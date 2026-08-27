import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import Simulators from '@/pages/simulator/Simulators';

describe('Simulators', () => {
    beforeEach(async () => {
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

    it('shows the multi-envelope simulator as coming soon, with no link', () => {
        render(<Simulators />);

        expect(screen.getByText(i18n.t('dashboard.simulators.multiEnvelope.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('dashboard.simulatorCard.comingSoonBadge'))).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.multiEnvelope.title')) }),
        ).not.toBeInTheDocument();
    });
});
