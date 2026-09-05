import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import MultiEnvelopeScenarioSummary from '@/features/scenarios/components/MultiEnvelopeScenarioSummary';
import type { MultiEnvelopeScenarioResult } from '@/features/multi-envelope-simulator/types';

const result: MultiEnvelopeScenarioResult = {
    summary: { year: 10, totalDeposited: 25000, grossBalance: 30000, netBalance: 26627.78, realNetBalanceWithInflation: 24000.55 },
    yearlyBreakdown: [
        { year: 1, totalDeposited: 2500, grossBalance: 2600, netBalance: 2560, realNetBalanceWithInflation: 2509.8 },
        { year: 10, totalDeposited: 25000, grossBalance: 30000, netBalance: 26627.78, realNetBalanceWithInflation: 24000.55 },
    ],
    pockets: [
        {
            accountType: 'PEA',
            initialDeposit: 5000,
            dcaDeposited: 10000,
            totalDeposited: 15000,
            dcaMonthsCount: 48,
            lastDcaAmount: 150,
            firstResidualDcaAmount: 0,
            ceilingReachedMonth: 36,
            grossBalance: 17200,
            totalGains: 2200,
            taxesAmount: 1200,
            incomeTaxAmount: 0,
            socialLeviesAmount: 1200,
            taxRegime: 'SOCIAL_LEVIES_ONLY',
            netBalance: 16000,
            brokerageFeesAmount: 10,
            managementFeesAmount: 40,
            terImpactAmount: 5,
            custodyFeesAmount: 0,
            arbitrageFeesAmount: 0,
            totalFeesAmount: 55,
        },
        {
            accountType: 'CTO',
            initialDeposit: 0,
            dcaDeposited: 10000,
            totalDeposited: 10000,
            dcaMonthsCount: 40,
            lastDcaAmount: 250,
            firstResidualDcaAmount: 300,
            ceilingReachedMonth: null,
            grossBalance: 11200,
            totalGains: 1200,
            taxesAmount: 572.22,
            incomeTaxAmount: 200,
            socialLeviesAmount: 372.22,
            taxRegime: 'FLAT_TAX',
            netBalance: 10627.78,
            brokerageFeesAmount: 20,
            managementFeesAmount: 0,
            terImpactAmount: 15,
            custodyFeesAmount: 5,
            arbitrageFeesAmount: 0,
            totalFeesAmount: 40,
        },
    ],
};

describe('MultiEnvelopeScenarioSummary', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the headline figures', () => {
        render(<MultiEnvelopeScenarioSummary result={result} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.summaryTitle'))).toBeInTheDocument();
        expect(screen.getByText('26 628 €')).toBeInTheDocument();
        expect(screen.getByText('24 001 €')).toBeInTheDocument();
        expect(screen.getAllByText('25 000 €').length).toBeGreaterThan(0);
    });

    it('renders the aggregated portfolio chart from yearlyBreakdown', () => {
        render(<MultiEnvelopeScenarioSummary result={result} />);

        expect(screen.getByText(i18n.t('scenario.chart.title'))).toBeInTheDocument();
    });

    it('renders the final-balance-by-envelope chart with a legend entry per pocket', () => {
        render(<MultiEnvelopeScenarioSummary result={result} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.finalBalanceChartTitle'))).toBeInTheDocument();
        expect(screen.getAllByText(i18n.t('simulator.multiEnvelope.accountTypes.PEA')).length).toBeGreaterThan(0);
        expect(screen.getAllByText(i18n.t('simulator.multiEnvelope.accountTypes.CTO')).length).toBeGreaterThan(0);
    });

    it('renders the enriched per-pocket detail: deposits, fees, taxation and result', () => {
        render(<MultiEnvelopeScenarioSummary result={result} />);

        // Deposits: DCA cumulé, months count, and the ceiling-reached mention for the PEA pocket.
        expect(screen.getAllByText('10 000 €', { exact: false }).length).toBeGreaterThan(0);
        expect(
            screen.getByText(i18n.t('scenario.multiEnvelope.pocket.deposits.ceilingReachedAtMonth', { month: 36 })),
        ).toBeInTheDocument();

        // Residual DCA is only shown for the CTO pocket (300 €), not the PEA one (0 €).
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.pocket.deposits.residualDca'))).toBeInTheDocument();

        // Fees: all 5 categories plus the total, for at least one pocket.
        expect(screen.getAllByText(i18n.t('scenario.multiEnvelope.pocket.fees.brokerage')).length).toBe(2);
        expect(screen.getAllByText(i18n.t('scenario.multiEnvelope.pocket.fees.total')).length).toBe(2);

        // Taxation: the resolved regime label and the IR/social levies split.
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.taxRegimes.SOCIAL_LEVIES_ONLY'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.taxRegimes.FLAT_TAX'))).toBeInTheDocument();

        // Result: gross gains and net balance.
        expect(screen.getAllByText(i18n.t('scenario.multiEnvelope.pocket.result.totalGains')).length).toBe(2);
    });
});
