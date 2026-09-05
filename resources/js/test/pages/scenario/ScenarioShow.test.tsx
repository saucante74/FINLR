import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import ScenarioShow from '@/pages/scenario/ScenarioShow';
import type { ScenarioProps } from '@/features/scenarios/types';

const props: ScenarioProps = {
    id: 42,
    name: null,
    input: {
        initialCapital: 1000,
        monthlyContribution: 200,
        annualRate: 5.5,
        years: 10,
        wrapperFee: 0.6,
        fundFee: 0.3,
        taxRate: 12.8,
        inflationRate: 2,
        inflationEnabled: true,
        wrapper: 'pea',
    },
    result: {
        points: [
            { year: 0, contributions: 1000, gross: 1000, netReal: 1000, netRealAdjusted: 1000 },
            { year: 10, contributions: 25000, gross: 34567.89, netReal: 31234.56, netRealAdjusted: 29000.12 },
        ],
        invested: 25000,
        grossGains: 9567.89,
        finalGross: 34567.89,
        netRealGains: 6234.56,
        finalNetReal: 31234.56,
        finalNetRealAdjusted: 29000.12,
        shortfall: 3333.33,
    },
    calculatorType: 'single_envelope',
    createdAt: '2026-01-15T10:00:00.000000Z',
};

const multiEnvelopeProps: ScenarioProps = {
    id: 43,
    name: null,
    input: props.input,
    result: {
        summary: { year: 10, totalDeposited: 25000, grossBalance: 30000, netBalance: 26627.78, realNetBalanceWithInflation: 24000.55 },
        yearlyBreakdown: [
            { year: 1, totalDeposited: 2500, grossBalance: 2600, netBalance: 2560, realNetBalanceWithInflation: 2509.8 },
            { year: 10, totalDeposited: 25000, grossBalance: 30000, netBalance: 26627.78, realNetBalanceWithInflation: 24000.55 },
        ],
        pockets: [
            {
                accountType: 'PEA',
                initialDeposit: 0,
                dcaDeposited: 25000,
                totalDeposited: 25000,
                dcaMonthsCount: 120,
                lastDcaAmount: 208.33,
                firstResidualDcaAmount: 0,
                ceilingReachedMonth: null,
                grossBalance: 30000,
                totalGains: 5000,
                taxesAmount: 3372.22,
                incomeTaxAmount: 0,
                socialLeviesAmount: 3372.22,
                taxRegime: 'SOCIAL_LEVIES_ONLY',
                netBalance: 26627.78,
                brokerageFeesAmount: 0,
                managementFeesAmount: 0,
                terImpactAmount: 0,
                custodyFeesAmount: 0,
                arbitrageFeesAmount: 0,
                totalFeesAmount: 0,
            },
        ],
    },
    calculatorType: 'multi_envelope',
    createdAt: '2026-01-15T10:00:00.000000Z',
};

describe('ScenarioShow page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the scenario summary and details instead of the raw scenario id', () => {
        render(<ScenarioShow {...props} />);

        expect(screen.getByText(i18n.t('scenario.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.summary.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.chart.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.details.title'))).toBeInTheDocument();
        expect(screen.queryByText(/scenarioId/i)).not.toBeInTheDocument();
    });

    it('renders the multi-envelope summary instead of the single-envelope details for a multi_envelope scenario', () => {
        render(<ScenarioShow {...multiEnvelopeProps} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.summaryTitle'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.pocketsTitle'))).toBeInTheDocument();
        // The aggregated portfolio chart is reused as-is for multi-envelope results (same component,
        // same title) — only the single-envelope-specific ScenarioDetails is absent here.
        expect(screen.getByText(i18n.t('scenario.chart.title'))).toBeInTheDocument();
        expect(screen.queryByText(i18n.t('scenario.details.title'))).not.toBeInTheDocument();
    });
});
