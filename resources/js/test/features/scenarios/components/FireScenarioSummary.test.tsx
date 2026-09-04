import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import FireScenarioSummary from '@/features/scenarios/components/FireScenarioSummary';
import type { FireScenarioResult } from '@/features/fire-simulator/types';
import { formatCompact } from '@/lib/currency';

// toHaveTextContent normalizes the DOM node's own text (NBSP -> regular
// space, collapsed whitespace) but not the string passed in, so the two
// sides must be normalized the same way before comparing — otherwise a
// currency string's non-breaking space (Intl.NumberFormat's own output)
// never matches the normalized DOM text it's checked against.
const compact = (value: number) => formatCompact(value, 'fr').replace(/ /g, ' ');

function makeResult(overrides: Partial<FireScenarioResult> = {}): FireScenarioResult {
    return {
        requiredCapital: 500_000,
        retirementAge: 55,
        yearsToRetirement: 25,
        optimistic: { requiredCapital: 400_000, retirementAge: 52, yearsToRetirement: 22 },
        neutral: { requiredCapital: 500_000, retirementAge: 55, yearsToRetirement: 25 },
        pessimistic: { requiredCapital: 666_666.67, retirementAge: 59, yearsToRetirement: 29 },
        ...overrides,
    };
}

describe('FireScenarioSummary', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the required capital and the retirement summary', () => {
        render(<FireScenarioSummary result={makeResult()} />);

        expect(screen.getAllByText(i18n.t('scenario.fire.requiredCapital')).length).toBeGreaterThan(0);
        // "neutral" deliberately matches the base result in this fixture
        // (docs/API.md §4: neutral reuses the base projection as-is), so
        // the same sentence legitimately renders twice.
        expect(
            screen.getAllByText(i18n.t('scenario.fire.retirementSummary', { age: '55.0', years: '25.0' })),
        ).toHaveLength(2);
    });

    it('shows an explicit message instead of a number when the target is never reached', () => {
        render(
            <FireScenarioSummary
                result={makeResult({ retirementAge: null, yearsToRetirement: null })}
            />,
        );

        expect(screen.getByText(i18n.t('scenario.fire.targetNotReached'))).toBeInTheDocument();
        expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
    });

    it('renders the three named scenarios', () => {
        render(<FireScenarioSummary result={makeResult()} />);

        // Each scenario name appears in the scenario list AND as a category
        // label under both bar charts (capital + years) — 3 occurrences.
        expect(screen.getAllByText(i18n.t('scenario.fire.scenarios.optimistic')).length).toBeGreaterThan(0);
        expect(screen.getAllByText(i18n.t('scenario.fire.scenarios.neutral')).length).toBeGreaterThan(0);
        expect(screen.getAllByText(i18n.t('scenario.fire.scenarios.pessimistic')).length).toBeGreaterThan(0);
    });

    it('shows a not-reached message for a scenario that never reaches its target', () => {
        render(
            <FireScenarioSummary
                result={makeResult({
                    pessimistic: { requiredCapital: 666_666.67, retirementAge: null, yearsToRetirement: null },
                })}
            />,
        );

        expect(screen.getAllByText(i18n.t('scenario.fire.targetNotReached')).length).toBeGreaterThan(0);
    });

    describe('scenario comparison chart', () => {
        it('renders a chart for required capital and one for years to retirement', () => {
            render(<FireScenarioSummary result={makeResult()} />);

            expect(screen.getByText(i18n.t('scenario.fire.chartTitle'))).toBeInTheDocument();
            expect(screen.getByRole('img', { name: i18n.t('scenario.fire.requiredCapital') })).toBeInTheDocument();
            expect(screen.getByRole('img', { name: i18n.t('scenario.fire.yearsToRetirement') })).toBeInTheDocument();
        });

        it('labels each bar with its formatted value in both charts', () => {
            render(<FireScenarioSummary result={makeResult()} />);

            const capitalChart = screen.getByRole('img', { name: i18n.t('scenario.fire.requiredCapital') });
            expect(capitalChart).toHaveTextContent(compact(400_000));
            expect(capitalChart).toHaveTextContent(compact(666_666.67));

            const yearsChart = screen.getByRole('img', { name: i18n.t('scenario.fire.yearsToRetirement') });
            expect(yearsChart).toHaveTextContent(i18n.t('scenario.fire.yearsValue', { years: '22.0' }));
            expect(yearsChart).toHaveTextContent(i18n.t('scenario.fire.yearsValue', { years: '29.0' }));
        });

        it('renders no bar and an explicit short label for a scenario whose target is never reached, without crashing or showing NaN/0', () => {
            render(
                <FireScenarioSummary
                    result={makeResult({
                        pessimistic: { requiredCapital: 900_000, retirementAge: null, yearsToRetirement: null },
                    })}
                />,
            );

            const yearsChart = screen.getByRole('img', { name: i18n.t('scenario.fire.yearsToRetirement') });
            expect(yearsChart).toHaveTextContent(i18n.t('scenario.fire.targetNotReachedShort'));
            expect(yearsChart).not.toHaveTextContent('NaN');
            expect(yearsChart).not.toHaveTextContent(i18n.t('scenario.fire.yearsValue', { years: '0.0' }));

            // requiredCapital is never null (docs/API.md §4), so that chart
            // still shows a real bar value for the same scenario.
            const capitalChart = screen.getByRole('img', { name: i18n.t('scenario.fire.requiredCapital') });
            expect(capitalChart).toHaveTextContent(compact(900_000));
        });
    });
});
