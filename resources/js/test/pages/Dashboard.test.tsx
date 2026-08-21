import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import * as inertia from '@inertiajs/react';
import Dashboard from '@/pages/Dashboard';
import type { ScenarioSummary } from '@/features/dashboard/types';

function mockAuth(permissions: string[]) {
    vi.spyOn(inertia, 'usePage').mockReturnValue({
        props: {
            auth: {
                user: {
                    id: 1,
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    email_verified_at: null,
                },
                plan: 'pro_monthly',
                permissions,
            },
        },
    } as unknown as ReturnType<typeof inertia.usePage>);
}

describe('Dashboard page', () => {
    beforeEach(async () => {
        vi.restoreAllMocks();
        await i18n.changeLanguage('fr');
    });

    it('renders the dashboard title and description', () => {
        mockAuth(['advanced_calculator']);

        render(<Dashboard scenarios={[]} />);

        expect(screen.getByRole('heading', { name: i18n.t('dashboard.title') })).toBeInTheDocument();
        expect(screen.getByText(i18n.t('dashboard.description'))).toBeInTheDocument();
    });

    it('shows an active link to the single-envelope simulator when the user has the permission', () => {
        mockAuth(['advanced_calculator']);

        render(<Dashboard scenarios={[]} />);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.singleEnvelope.title')) }),
        ).toHaveAttribute('href', route('simulators.single-envelope.show'));
    });

    it('shows a locked single-envelope card with no link when the user lacks the permission', () => {
        mockAuth([]);

        render(<Dashboard scenarios={[]} />);

        expect(screen.getByText(i18n.t('dashboard.simulators.singleEnvelope.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('dashboard.simulatorCard.lockedBadge'))).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.singleEnvelope.title')) }),
        ).not.toBeInTheDocument();
    });

    it('shows the multi-envelope simulator as coming soon, regardless of permissions', () => {
        mockAuth(['advanced_calculator']);

        render(<Dashboard scenarios={[]} />);

        expect(screen.getByText(i18n.t('dashboard.simulators.multiEnvelope.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('dashboard.simulatorCard.comingSoonBadge'))).toBeInTheDocument();
    });

    it('renders the scenarios received in props', () => {
        mockAuth(['advanced_calculator']);
        const scenarios: ScenarioSummary[] = [
            { id: 1, calculatorType: 'single_envelope', headlineFigure: 31234.56, createdAt: '2026-01-15T10:00:00.000000Z' },
        ];

        render(<Dashboard scenarios={scenarios} />);

        expect(
            screen.getByText(i18n.t('dashboard.scenarioList.calculatorTypes.single_envelope')),
        ).toBeInTheDocument();
    });
});
