import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import * as inertia from '@inertiajs/react';
import Dashboard from '@/pages/Dashboard';
import type { CalculatorType, ScenarioSummary } from '@/features/dashboard/types';
import type { Paginated, Plan } from '@/types';

function paginate(data: ScenarioSummary[]): Paginated<ScenarioSummary> {
    return { data, currentPage: 1, lastPage: 1, perPage: 10, total: data.length };
}

const emptyScenarios = paginate([]);

function renderDashboard(
    scenarios: Paginated<ScenarioSummary>,
    scenarioTypeFilter: CalculatorType | null = null,
    status: string | null = null,
) {
    return render(<Dashboard scenarios={scenarios} scenarioTypeFilter={scenarioTypeFilter} status={status} />);
}

function mockAuth(permissions: string[], plan: Plan = 'free') {
    vi.spyOn(inertia, 'usePage').mockReturnValue({
        url: '/dashboard',
        props: {
            auth: {
                user: {
                    id: 1,
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    email_verified_at: null,
                },
                plan,
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

    it('renders a personalized greeting and description', () => {
        mockAuth(['advanced_calculator']);

        renderDashboard(emptyScenarios);

        expect(
            screen.getByRole('heading', {
                name: i18n.t('dashboard.greeting', { name: 'Jane Doe' }),
            }),
        ).toBeInTheDocument();
        expect(screen.getByText(i18n.t('dashboard.description'))).toBeInTheDocument();
    });

    it('shows a generic "view all simulators" card, always active, pointing to the simulators list', () => {
        mockAuth([]);

        renderDashboard(emptyScenarios);

        const link = screen.getByRole('link', {
            name: new RegExp(i18n.t('dashboard.simulators.viewAll.title')),
        });
        expect(link).toHaveAttribute('href', route('simulators.index'));
    });

    it('renders the generic "view all" card with a subtler, non-brand CTA than the 3 fixed simulator cards', () => {
        mockAuth(['advanced_calculator']);

        renderDashboard(emptyScenarios);

        const viewAllCta = screen.getAllByText(i18n.t('dashboard.simulators.viewAll.title')).find(
            (el) => el.tagName === 'SPAN' && el.className.includes('inline-flex'),
        );
        const fixedCtas = screen.getAllByText(i18n.t('dashboard.simulatorCard.cta'));

        expect(viewAllCta?.className).not.toContain('text-brand');
        expect(fixedCtas.length).toBeGreaterThan(0);
        fixedCtas.forEach((cta) => expect(cta.className).toContain('text-brand'));
    });

    it('shows exactly 4 simulator cards on the dashboard', () => {
        mockAuth(['advanced_calculator']);

        renderDashboard(emptyScenarios);

        expect(screen.getByText(i18n.t('dashboard.simulators.singleEnvelope.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('dashboard.simulators.analogy.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('dashboard.simulators.fire.title'))).toBeInTheDocument();
        expect(
            screen.getAllByText(i18n.t('dashboard.simulators.viewAll.title')).length,
        ).toBeGreaterThan(0);
        expect(screen.queryByText(i18n.t('dashboard.simulators.multiEnvelope.title'))).not.toBeInTheDocument();
    });

    it('shows an active link to the single-envelope simulator when the user has the permission', () => {
        mockAuth(['advanced_calculator']);

        renderDashboard(emptyScenarios);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.singleEnvelope.title')) }),
        ).toHaveAttribute('href', route('simulators.single-envelope.choose'));
    });

    it('shows a locked single-envelope card with no link when the user lacks the permission', () => {
        mockAuth([]);

        renderDashboard(emptyScenarios);

        expect(screen.getByText(i18n.t('dashboard.simulators.singleEnvelope.title'))).toBeInTheDocument();
        // Both cards are locked without the permission, so the badge appears twice.
        expect(screen.getAllByText(i18n.t('dashboard.simulatorCard.lockedBadge')).length).toBeGreaterThan(0);
        expect(
            screen.queryByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.singleEnvelope.title')) }),
        ).not.toBeInTheDocument();
    });

    it('shows an active link to the analogy simulator when the user has the permission', () => {
        mockAuth(['advanced_calculator']);

        renderDashboard(emptyScenarios);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.analogy.title')) }),
        ).toHaveAttribute('href', route('simulators.analogy.show'));
    });

    it('shows a locked analogy card with no link when the user lacks the permission', () => {
        mockAuth([]);

        renderDashboard(emptyScenarios);

        expect(screen.getByText(i18n.t('dashboard.simulators.analogy.title'))).toBeInTheDocument();
        expect(screen.getAllByText(i18n.t('dashboard.simulatorCard.lockedBadge')).length).toBeGreaterThan(0);
        expect(
            screen.queryByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.analogy.title')) }),
        ).not.toBeInTheDocument();
    });

    it('shows an active link to the fire simulator when the user has the permission', () => {
        mockAuth(['advanced_calculator']);

        renderDashboard(emptyScenarios);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.fire.title')) }),
        ).toHaveAttribute('href', route('simulators.fire.show'));
    });

    it('shows a locked fire card with no link when the user lacks the permission', () => {
        mockAuth([]);

        renderDashboard(emptyScenarios);

        expect(screen.getByText(i18n.t('dashboard.simulators.fire.title'))).toBeInTheDocument();
        expect(screen.getAllByText(i18n.t('dashboard.simulatorCard.lockedBadge')).length).toBeGreaterThan(0);
        expect(
            screen.queryByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.fire.title')) }),
        ).not.toBeInTheDocument();
    });

    it('renders the scenarios received in props, falling back to the generic label when unnamed', () => {
        mockAuth(['advanced_calculator']);
        const scenarios: ScenarioSummary[] = [
            {
                id: 1,
                calculatorType: 'single_envelope',
                typeLabel: 'dashboard.scenarioList.calculatorTypes.single_envelope',
                headlineFigure: 31234.56,
                createdAt: '2026-01-15T10:00:00.000000Z',
                wrapper: 'pea',
                years: 15,
                name: null,
            },
        ];

        renderDashboard(paginate(scenarios));

        expect(screen.getByText(i18n.t('dashboard.scenarioList.genericLabel'))).toBeInTheDocument();
    });

    it('never renders a euro amount in the promo block: prices only live in Stripe', () => {
        mockAuth([]);

        renderDashboard(emptyScenarios);

        expect(screen.getByText(i18n.t('dashboard.promo.title'))).toBeInTheDocument();
        expect(screen.getByRole('button', { name: i18n.t('dashboard.promo.cta') })).toBeEnabled();
        expect(screen.queryByText(/€/)).not.toBeInTheDocument();
    });

    it('offers a monthly/yearly choice before going premium, without any trial wording', () => {
        mockAuth([]);

        renderDashboard(emptyScenarios);

        expect(screen.getByRole('button', { name: i18n.t('dashboard.promo.periods.monthly') })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: i18n.t('dashboard.promo.periods.yearly') })).toHaveAttribute('aria-pressed', 'false');
        expect(screen.queryByText(i18n.t('dashboard.simulatorCard.comingSoonBadge'))).not.toBeInTheDocument();
        expect(screen.queryByText(/14/)).not.toBeInTheDocument();
    });

    it('hides the upgrade offer from a premium user', () => {
        mockAuth(['advanced_calculator'], 'premium');

        renderDashboard(emptyScenarios);

        expect(screen.queryByText(i18n.t('dashboard.promo.title'))).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: i18n.t('dashboard.promo.cta') })).not.toBeInTheDocument();
    });

    it('announces a pending activation when coming back from Stripe Checkout', () => {
        mockAuth([]);

        renderDashboard(emptyScenarios, null, 'premium-checkout-completed');

        expect(screen.getByRole('status')).toHaveTextContent(i18n.t('dashboard.promo.checkoutPending'));
    });

    it('shows no checkout status message by default', () => {
        mockAuth([]);

        renderDashboard(emptyScenarios);

        expect(screen.queryByText(i18n.t('dashboard.promo.checkoutPending'))).not.toBeInTheDocument();
    });
});
