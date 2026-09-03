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

    it('links the multi-envelope simulator to its show page', () => {
        render(<Simulators />);

        expect(
            screen.getByRole('link', { name: new RegExp(i18n.t('dashboard.simulators.multiEnvelope.title')) }),
        ).toHaveAttribute('href', route('simulators.multi-envelope.show'));
        expect(screen.queryByText(i18n.t('dashboard.simulatorCard.comingSoonBadge'))).not.toBeInTheDocument();
    });
});
