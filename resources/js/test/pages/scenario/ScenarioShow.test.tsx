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
        summary: { year: 10, totalDeposited: 25000, netBalance: 26627.78, realNetBalanceWithInflation: 24000.55 },
        pockets: [
            { accountType: 'PEA', totalDeposited: 25000, netBalance: 26627.78, taxRegime: 'SOCIAL_LEVIES_ONLY' },
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

    it('renders the multi-envelope summary instead of the single-envelope chart/details for a multi_envelope scenario', () => {
        render(<ScenarioShow {...multiEnvelopeProps} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.summaryTitle'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.multiEnvelope.pocketsTitle'))).toBeInTheDocument();
        expect(screen.queryByText(i18n.t('scenario.chart.title'))).not.toBeInTheDocument();
        expect(screen.queryByText(i18n.t('scenario.details.title'))).not.toBeInTheDocument();
    });
});
