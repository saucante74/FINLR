import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import FireScenarioSummary from '@/features/scenarios/components/FireScenarioSummary';
import type { FireScenarioResult } from '@/features/fire-simulator/types';

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

        expect(screen.getByText(i18n.t('scenario.fire.requiredCapital'))).toBeInTheDocument();
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

        expect(screen.getByText(i18n.t('scenario.fire.scenarios.optimistic'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.fire.scenarios.neutral'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.fire.scenarios.pessimistic'))).toBeInTheDocument();
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
});
