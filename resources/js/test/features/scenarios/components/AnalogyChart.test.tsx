import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import AnalogyChart from '@/features/scenarios/components/AnalogyChart';
import type { AnalogyScenarioResult, AnalogyYearlyPoint } from '@/features/analogy-simulator/types';

const zeroDelta = { valueA: 0, valueB: 0, absolute: 0, percent: null };

function makePoint(overrides: Partial<AnalogyYearlyPoint> = {}): AnalogyYearlyPoint {
    return {
        year: 1,
        netBalance: zeroDelta,
        realNetBalanceWithInflation: zeroDelta,
        totalDeposited: zeroDelta,
        leader: 'SCENARIO_A',
        ceilingEventsA: [],
        ceilingEventsB: [],
        hasCeilingEvent: false,
        ...overrides,
    };
}

function makeResult(overrides: Partial<AnalogyScenarioResult> = {}): AnalogyScenarioResult {
    return {
        labelA: 'Mon PEA',
        labelB: 'Mon CTO',
        realNetBalanceWithInflation: { valueA: 100_000, valueB: 105_000, absolute: 5_000, percent: 0.05 },
        netBalance: zeroDelta,
        totalGains: zeroDelta,
        taxesAmount: zeroDelta,
        totalFees: zeroDelta,
        totalDeposited: zeroDelta,
        yearlyBreakdown: [
            makePoint({ year: 1, realNetBalanceWithInflation: { valueA: 1_000, valueB: 900, absolute: -100, percent: -0.1 } }),
            makePoint({ year: 2, realNetBalanceWithInflation: { valueA: 2_000, valueB: 2_100, absolute: 100, percent: 0.05 } }),
        ],
        finalLeader: 'SCENARIO_B',
        crossoverYears: [],
        hasCrossover: false,
        ...overrides,
    };
}

describe('AnalogyChart', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('labels the legend with the real scenario names, not a hardcoded "Scénario A/B"', () => {
        render(<AnalogyChart result={makeResult()} />);

        expect(screen.getByText('Mon PEA')).toBeInTheDocument();
        expect(screen.getByText('Mon CTO')).toBeInTheDocument();
        expect(screen.queryByText('Scénario A')).not.toBeInTheDocument();
        expect(screen.queryByText('Scénario B')).not.toBeInTheDocument();
    });

    it('does not show a crossover legend entry when there is no crossover', () => {
        render(<AnalogyChart result={makeResult({ hasCrossover: false, crossoverYears: [] })} />);

        expect(screen.queryByText(i18n.t('scenario.analogy.chartCrossoverLegend'))).not.toBeInTheDocument();
    });

    it('shows a crossover legend entry and a guideline when there is a crossover', () => {
        const { container } = render(
            <AnalogyChart
                result={makeResult({
                    hasCrossover: true,
                    crossoverYears: [2],
                    yearlyBreakdown: [
                        makePoint({ year: 1 }),
                        makePoint({ year: 2 }),
                        makePoint({ year: 3 }),
                    ],
                })}
            />,
        );

        expect(screen.getByText(i18n.t('scenario.analogy.chartCrossoverLegend'))).toBeInTheDocument();
        // Dashed vertical guideline at the crossover year — the only dashed
        // line besides the horizontal gridlines (which use a lighter dash).
        const dashedLines = container.querySelectorAll('line[stroke-dasharray="4 3"]');
        expect(dashedLines.length).toBe(1);
    });

    it('renders a ringed marker on the scenario line that has a ceiling event that year, and none on the other', () => {
        const { container } = render(
            <AnalogyChart
                result={makeResult({
                    yearlyBreakdown: [
                        makePoint({ year: 1 }),
                        makePoint({
                            year: 2,
                            hasCeilingEvent: true,
                            ceilingEventsA: [{ accountType: 'PEA', ceiling: 150_000, year: 2, isReachedOnInitialDeposit: false }],
                        }),
                    ],
                })}
            />,
        );

        // 2 hover-dot circles are only rendered on mouse move; with no
        // hover, the only circles present are ceiling markers — exactly one
        // here (scenario A's line only, per ceilingEventsA above).
        const circles = container.querySelectorAll('circle');
        expect(circles.length).toBe(1);
    });

    it('renders no line/marker crash when yearlyBreakdown is empty', () => {
        render(<AnalogyChart result={makeResult({ yearlyBreakdown: [] })} />);

        expect(screen.getByText('Mon PEA')).toBeInTheDocument();
    });
});
