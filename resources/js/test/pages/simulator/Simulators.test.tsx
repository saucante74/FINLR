import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import * as inertia from '@inertiajs/react';
import Simulators from '@/pages/simulator/Simulators';
import type { Permission, Plan } from '@/types';

function mockAuth(permissions: Permission[], plan: Plan) {
    vi.spyOn(inertia, 'usePage').mockReturnValue({
        url: '/simulators',
        props: {
            auth: {
                user: { id: 1, name: 'Jane Doe', email: 'jane@example.com', email_verified_at: null },
                plan,
                permissions,
            },
        },
    } as unknown as ReturnType<typeof inertia.usePage>);
}

describe('Simulators', () => {
    beforeEach(async () => {
        vi.restoreAllMocks();
        mockAuth(['export_reports', 'create_project', 'advanced_calculator'], 'premium');
        await i18n.changeLanguage('fr');
    });

    it('renders the heading', () => {
        render(<Simulators />);

        expect(
            screen.getByRole('heading', { level: 1, name: i18n.t('simulator.index.title') }),
        ).toBeInTheDocument();
    });

    it('links the classic simulator to the wrapper choice page', () => {
        render(<Simulators />);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.singleEnvelope.title')) }),
        ).toHaveAttribute('href', route('simulators.single-envelope.choose'));
    });

    it('links the multi-envelope simulator to its show page', () => {
        render(<Simulators />);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.multiEnvelope.title')) }),
        ).toHaveAttribute('href', route('simulators.multi-envelope.show'));
        expect(screen.queryByText(i18n.t('dashboard.simulatorCard.comingSoonBadge'))).not.toBeInTheDocument();
    });

    it('links the analogy simulator to its show page', () => {
        render(<Simulators />);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.analogy.title')) }),
        ).toHaveAttribute('href', route('simulators.analogy.show'));
    });

    it('links the fire simulator to its show page', () => {
        render(<Simulators />);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.fire.title')) }),
        ).toHaveAttribute('href', route('simulators.fire.show'));
    });

    it('shows an icon for every simulator instead of a number', () => {
        render(<Simulators />);

        expect(screen.queryByText('01')).not.toBeInTheDocument();
        expect(screen.queryByText('02')).not.toBeInTheDocument();
    });

    it('renders the exact same icon per simulator as the dashboard cards (SIMULATOR_ICONS)', () => {
        const { container } = render(<Simulators />);

        expect(container.querySelector('svg.lucide-piggy-bank')).toBeInTheDocument();
        expect(container.querySelector('svg.lucide-layers')).toBeInTheDocument();
        expect(container.querySelector('svg.lucide-scale')).toBeInTheDocument();
        expect(container.querySelector('svg.lucide-flame')).toBeInTheDocument();
    });

    describe('for a user without the advanced calculator permission', () => {
        beforeEach(() => {
            mockAuth(['create_project'], 'free');
        });

        it('lists every simulator but links to none of them', () => {
            render(<Simulators />);

            for (const key of ['singleEnvelope', 'multiEnvelope', 'analogy', 'fire']) {
                const title = i18n.t(`dashboard.simulators.${key}.title`);

                expect(screen.getByText(title)).toBeInTheDocument();
                expect(screen.queryByRole('link', { name: new RegExp(title) })).not.toBeInTheDocument();
            }
        });

        it('marks each simulator as premium instead of coming soon', () => {
            render(<Simulators />);

            expect(screen.getAllByText(i18n.t('dashboard.simulatorCard.lockedBadge'))).toHaveLength(4);
            expect(screen.queryByText(i18n.t('dashboard.simulatorCard.comingSoonBadge'))).not.toBeInTheDocument();
        });
    });
});
