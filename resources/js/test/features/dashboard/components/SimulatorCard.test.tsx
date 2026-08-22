import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import SimulatorCard from '@/features/dashboard/components/SimulatorCard';

describe('SimulatorCard', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders as a link to href when active', () => {
        render(
            <SimulatorCard
                index={1}
                title="Simulateur mono-enveloppe"
                description="Une description"
                state="active"
                href="/simulators/single-envelope"
            />,
        );

        expect(
            screen.getByRole('link', { name: /Simulateur mono-enveloppe/ }),
        ).toHaveAttribute('href', '/simulators/single-envelope');
    });

    it('shows a locked badge and note, with no link, when locked', () => {
        render(
            <SimulatorCard
                index={1}
                title="Simulateur mono-enveloppe"
                description="Une description"
                state="locked"
                note="Passez premium"
            />,
        );

        expect(screen.getByText(i18n.t('dashboard.simulatorCard.lockedBadge'))).toBeInTheDocument();
        expect(screen.getByText('Passez premium')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('shows a coming-soon badge, with no link, when comingSoon', () => {
        render(
            <SimulatorCard
                index={1}
                title="Simulateur multi-enveloppe"
                description="Une description"
                state="comingSoon"
            />,
        );

        expect(screen.getByText(i18n.t('dashboard.simulatorCard.comingSoonBadge'))).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
});
