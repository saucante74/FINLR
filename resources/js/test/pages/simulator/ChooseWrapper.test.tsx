import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import ChooseWrapper from '@/pages/simulator/ChooseWrapper';
import type { JurisdictionWrapperSection } from '@/features/single-envelope-simulator/types';

/** Decorative nodes (the monogram tiles) repeat wrapper codes verbatim. */
const DECORATIVE = '[aria-hidden="true"], script, style';

const sections: JurisdictionWrapperSection[] = [
    { jurisdiction: 'france', wrappers: ['pea', 'cto'] },
];

function renderPage() {
    return render(<ChooseWrapper sections={sections} />);
}

describe('ChooseWrapper', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the heading and the counted France section', () => {
        renderPage();

        expect(
            screen.getByRole('heading', { level: 1, name: 'Choisissez votre enveloppe fiscale' }),
        ).toBeInTheDocument();

        expect(screen.getByRole('heading', { level: 2, name: /France/ })).toHaveTextContent('02');
    });

    it('links each wrapper to its simulator', () => {
        renderPage();

        const links = screen
            .getAllByRole('link')
            .map((link) => link.getAttribute('href'))
            .filter((href): href is string => Boolean(href?.includes('single-envelope.show')));

        expect(links).toEqual([
            '/simulators.single-envelope.show?jurisdiction=france&wrapper=pea',
            '/simulators.single-envelope.show?jurisdiction=france&wrapper=cto',
        ]);
    });

    it('describes each wrapper with its highlights', () => {
        renderPage();

        const peaRow = screen.getByText('PEA', { ignore: DECORATIVE }).closest('li');

        expect(peaRow).not.toBeNull();
        expect(within(peaRow as HTMLElement).getByText(/Plan d’Épargne en Actions/)).toBeInTheDocument();
        expect(within(peaRow as HTMLElement).getByText('Plafond 150 000 €')).toBeInTheDocument();
        expect(within(peaRow as HTMLElement).getByText('17,2 % après 5 ans')).toBeInTheDocument();

        const ctoRow = screen.getByText('CTO', { ignore: DECORATIVE }).closest('li');

        expect(ctoRow).not.toBeNull();
        expect(within(ctoRow as HTMLElement).getByText('Sans plafond')).toBeInTheDocument();
        expect(within(ctoRow as HTMLElement).getByText('PFU 30 %')).toBeInTheDocument();
    });
});
