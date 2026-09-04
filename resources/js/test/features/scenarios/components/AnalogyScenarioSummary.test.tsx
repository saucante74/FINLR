import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import AnalogyScenarioSummary from '@/features/scenarios/components/AnalogyScenarioSummary';
import type { AnalogyScenarioResult } from '@/features/analogy-simulator/types';

const zeroDelta = { valueA: 0, valueB: 0, absolute: 0, percent: null };

function makeResult(overrides: Partial<AnalogyScenarioResult> = {}): AnalogyScenarioResult {
    return {
        labelA: 'PEA plafonné',
        labelB: 'CTO sans plafond',
        realNetBalanceWithInflation: { valueA: 100000, valueB: 105000, absolute: 5000, percent: 0.05 },
        netBalance: zeroDelta,
        totalGains: zeroDelta,
        taxesAmount: zeroDelta,
        totalFees: zeroDelta,
        totalDeposited: zeroDelta,
        yearlyBreakdown: [],
        finalLeader: 'SCENARIO_B',
        crossoverYears: [],
        hasCrossover: false,
        ...overrides,
    };
}

describe('AnalogyScenarioSummary', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders both scenario labels and the leader', () => {
        render(<AnalogyScenarioSummary result={makeResult()} />);

        // Each label now also appears in the deltas table header and the
        // chart legend, in addition to the summary card title.
        expect(screen.getAllByText('PEA plafonné').length).toBeGreaterThan(0);
        expect(screen.getAllByText('CTO sans plafond').length).toBeGreaterThan(0);
        expect(
            screen.getByText(i18n.t('scenario.analogy.leader', { label: 'CTO sans plafond' })),
        ).toBeInTheDocument();
    });

    it('renders the tie label when the final leader is a tie', () => {
        render(<AnalogyScenarioSummary result={makeResult({ finalLeader: 'TIE' })} />);

        expect(screen.getByText(i18n.t('scenario.analogy.tie'))).toBeInTheDocument();
    });

    it('shows the crossover years only when there is a crossover', () => {
        const { rerender } = render(<AnalogyScenarioSummary result={makeResult()} />);

        expect(screen.queryByText(/crois/i)).not.toBeInTheDocument();

        rerender(<AnalogyScenarioSummary result={makeResult({ hasCrossover: true, crossoverYears: [14] })} />);

        expect(
            screen.getByText(i18n.t('scenario.analogy.crossoverYears', { years: '14' })),
        ).toBeInTheDocument();
    });

    it('renders the five documented delta metrics', () => {
        render(<AnalogyScenarioSummary result={makeResult()} />);

        expect(screen.getByText(i18n.t('scenario.analogy.metrics.realNetBalanceWithInflation'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.analogy.metrics.totalDeposited'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.analogy.metrics.totalGains'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.analogy.metrics.taxesAmount'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.analogy.metrics.totalFees'))).toBeInTheDocument();
    });

    it('shows ceiling events only for years that have one', () => {
        const withCeiling = makeResult({
            yearlyBreakdown: [
                {
                    year: 13,
                    netBalance: zeroDelta,
                    realNetBalanceWithInflation: zeroDelta,
                    totalDeposited: zeroDelta,
                    leader: 'SCENARIO_A',
                    ceilingEventsA: [
                        { accountType: 'PEA', ceiling: 150000, year: 13, isReachedOnInitialDeposit: false },
                    ],
                    ceilingEventsB: [],
                    hasCeilingEvent: true,
                },
                {
                    year: 14,
                    netBalance: zeroDelta,
                    realNetBalanceWithInflation: zeroDelta,
                    totalDeposited: zeroDelta,
                    leader: 'SCENARIO_B',
                    ceilingEventsA: [],
                    ceilingEventsB: [],
                    hasCeilingEvent: false,
                },
            ],
        });

        render(<AnalogyScenarioSummary result={withCeiling} />);

        expect(screen.getByText(i18n.t('scenario.analogy.yearLabel', { year: 13 }))).toBeInTheDocument();
        expect(screen.queryByText(i18n.t('scenario.analogy.yearLabel', { year: 14 }))).not.toBeInTheDocument();
        expect(
            screen.getByText(
                i18n.t('scenario.analogy.ceilingEvent', {
                    scenario: 'PEA plafonné',
                    accountType: i18n.t('simulator.analogy.accountTypes.PEA'),
                    ceiling: '150 000 €',
                }),
            ),
        ).toBeInTheDocument();
    });
});
