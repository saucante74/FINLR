import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import MultiEnvelopeScenarioSummary from '@/features/scenarios/components/MultiEnvelopeScenarioSummary';
import type { MultiEnvelopeScenarioInput, MultiEnvelopeScenarioResult } from '@/features/multi-envelope-simulator/types';

// Mirrors the reference scenario from blueprints/simulators_multi-envelope-scenario.pdf
// ("Verdict d'abord"): Livret A (exempt) + CTO (PFU), 15 years.
const result: MultiEnvelopeScenarioResult = {
    summary: { year: 15, totalDeposited: 101970, grossBalance: 184395, netBalance: 167747, realNetBalanceWithInflation: 124639 },
    yearlyBreakdown: [
        { year: 1, totalDeposited: 8000, grossBalance: 8200, netBalance: 8180, realNetBalanceWithInflation: 8020 },
        { year: 15, totalDeposited: 101970, grossBalance: 184395, netBalance: 167747, realNetBalanceWithInflation: 124639 },
    ],
    pockets: [
        {
            accountType: 'LIVRET_A',
            initialDeposit: 0,
            dcaDeposited: 22950,
            totalDeposited: 22950,
            dcaMonthsCount: 12,
            lastDcaAmount: 950,
            firstResidualDcaAmount: 0,
            ceilingReachedMonth: 12,
            grossBalance: 49882,
            totalGains: 26932,
            taxesAmount: 0,
            incomeTaxAmount: 0,
            socialLeviesAmount: 0,
            taxRegime: 'EXEMPT',
            netBalance: 49882,
            brokerageFeesAmount: 0,
            managementFeesAmount: 2200,
            terImpactAmount: 0,
            custodyFeesAmount: 0,
            arbitrageFeesAmount: 0,
            totalFeesAmount: 2200,
        },
        {
            accountType: 'CTO',
            initialDeposit: 0,
            dcaDeposited: 79020,
            totalDeposited: 79020,
            dcaMonthsCount: 180,
            lastDcaAmount: 439,
            firstResidualDcaAmount: 1050,
            ceilingReachedMonth: null,
            grossBalance: 134513,
            totalGains: 55493,
            taxesAmount: 16648,
            incomeTaxAmount: 7099,
            socialLeviesAmount: 9549,
            taxRegime: 'FLAT_TAX',
            netBalance: 117865,
            brokerageFeesAmount: 0,
            managementFeesAmount: 5933,
            terImpactAmount: 0,
            custodyFeesAmount: 0,
            arbitrageFeesAmount: 0,
            totalFeesAmount: 5933,
        },
    ],
    totalFeesAmount: 8133,
};

const input: MultiEnvelopeScenarioInput = {
    envelopes: [
        { accountType: 'LIVRET_A', monthlyContribution: 0, durationYears: 15, annualReturnRate: 0.03, inflationRate: 0.02 },
        { accountType: 'CTO', monthlyContribution: 439, durationYears: 15, annualReturnRate: 0.063, inflationRate: 0.02 },
    ],
};

describe('MultiEnvelopeScenarioSummary ("Verdict d\'abord")', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the hero: net balance, multiplier and the narrative sentence', () => {
        render(<MultiEnvelopeScenarioSummary result={result} input={input} />);

        expect(screen.getAllByText('167 747 €').length).toBeGreaterThan(0);
        expect(screen.getByText('×1,65')).toBeInTheDocument();
        expect(
            screen.getByText(
                i18n.t('scenario.multiEnvelope.verdict.narrative', {
                    deposited: '101 970 €',
                    netGains: '65 777 €',
                    realNet: '124 639 €',
                }),
            ),
        ).toBeInTheDocument();
    });

    it('renders the 4 stat tiles, replacing the unavailable "TRI net" with the real total-fees figure', () => {
        render(<MultiEnvelopeScenarioSummary result={result} input={input} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.verdict.stats.netGain'))).toBeInTheDocument();
        expect(screen.getAllByText(i18n.t('scenario.multiEnvelope.verdict.stats.totalFees')).length).toBeGreaterThan(0);
        expect(screen.getAllByText('8 133 €').length).toBeGreaterThan(0);
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.verdict.stats.realNet'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.verdict.stats.inflationCost'))).toBeInTheDocument();
        expect(screen.queryByText(/TRI/i)).not.toBeInTheDocument();
    });

    it('reuses ScenarioChart for the aggregated portfolio curve', () => {
        render(<MultiEnvelopeScenarioSummary result={result} input={input} />);

        expect(screen.getByText(i18n.t('scenario.chart.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.verdict.chartSubtitle'))).toBeInTheDocument();
    });

    it('renders "Où va l\'argent" with the deposits/gains/tax breakdown and a fees note', () => {
        render(<MultiEnvelopeScenarioSummary result={result} input={input} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.verdict.breakdown.title'))).toBeInTheDocument();
        expect(screen.getAllByText('101 970 €').length).toBeGreaterThan(0);
        expect(screen.getAllByText('65 777 €').length).toBeGreaterThan(0);
        expect(screen.getAllByText('16 648 €').length).toBeGreaterThan(0);
    });

    it('names the taxed envelope in the tax note when exactly one pocket pays tax', () => {
        render(<MultiEnvelopeScenarioSummary result={result} input={input} />);

        // Only the CTO pocket has taxesAmount > 0 here (Livret A is exempt) — 16648/55493 ≈ 30%.
        expect(
            screen.getByText(
                i18n.t('scenario.multiEnvelope.verdict.breakdown.taxNoteNamed', {
                    percent: '30,0 %',
                    accountType: i18n.t('simulator.multiEnvelope.accountTypes.CTO'),
                }),
            ),
        ).toBeInTheDocument();
    });

    it('renders the read-only "Hypothèses" panel with real per-envelope input values, no recompute copy', () => {
        render(<MultiEnvelopeScenarioSummary result={result} input={input} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.verdict.hypotheses.title'))).toBeInTheDocument();
        expect(screen.getByText('6,3 %')).toBeInTheDocument();
        expect(screen.getByText('439 €')).toBeInTheDocument();
        expect(screen.queryByText(/se recalcule/i)).not.toBeInTheDocument();
        expect(screen.queryByText(i18n.t('scenario.multiEnvelope.verdict.hypotheses.subtitle'))).toBeInTheDocument();
    });

    it('renders the comparison table with one column per envelope and a total column', () => {
        render(<MultiEnvelopeScenarioSummary result={result} input={input} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.pocketsTitle'))).toBeInTheDocument();
        expect(screen.getAllByText(i18n.t('simulator.multiEnvelope.accountTypes.LIVRET_A')).length).toBeGreaterThan(0);
        expect(screen.getAllByText(i18n.t('simulator.multiEnvelope.accountTypes.CTO')).length).toBeGreaterThan(0);
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.taxRegimes.EXEMPT'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.taxRegimes.FLAT_TAX'), { exact: false })).toBeInTheDocument();
        expect(screen.getAllByText('167 747 €').length).toBeGreaterThan(0);
    });
});
