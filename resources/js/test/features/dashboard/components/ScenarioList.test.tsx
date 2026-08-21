import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import ScenarioList from '@/features/dashboard/components/ScenarioList';
import type { ScenarioSummary } from '@/features/dashboard/types';

describe('ScenarioList', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('shows an explicit empty state when there are no scenarios', () => {
        render(<ScenarioList scenarios={[]} />);

        expect(screen.getByText(i18n.t('dashboard.scenarioList.empty'))).toBeInTheDocument();
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders one row per scenario, linking to its detail page', () => {
        const scenarios: ScenarioSummary[] = [
            {
                id: 42,
                calculatorType: 'single_envelope',
                headlineFigure: 31234.56,
                createdAt: '2026-01-15T10:00:00.000000Z',
            },
        ];

        render(<ScenarioList scenarios={scenarios} />);

        expect(
            screen.getByText(i18n.t('dashboard.scenarioList.calculatorTypes.single_envelope')),
        ).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', route('scenarios.show', 42));
        expect(screen.queryByText(i18n.t('dashboard.scenarioList.empty'))).not.toBeInTheDocument();
    });
});
