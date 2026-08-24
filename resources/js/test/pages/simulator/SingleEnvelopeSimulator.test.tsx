import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import SingleEnvelopeSimulator from '@/pages/simulator/SingleEnvelopeSimulator';
import type { SingleEnvelopeFormDefaults } from '@/features/single-envelope-simulator/types';

const defaults: SingleEnvelopeFormDefaults = {
    initialCapital: 10000,
    monthlyContribution: 300,
    annualRate: 6,
    years: 15,
    wrapperFee: 0.5,
    fundFee: 0.3,
    taxRate: 30,
    inflationRate: 2,
    inflationEnabled: false,
};

describe('SingleEnvelopeSimulator page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('titles the page after the wrapper it was opened for', () => {
        render(<SingleEnvelopeSimulator defaults={defaults} jurisdiction="france" wrapper="cto" />);

        expect(screen.getByRole('heading', { level: 1, name: 'Simulation : CTO' })).toBeInTheDocument();
    });

    it('shows the wrapper-specific subtitle, not a literal one', () => {
        const { rerender } = render(
            <SingleEnvelopeSimulator defaults={defaults} jurisdiction="france" wrapper="pea" />,
        );

        expect(screen.getByText(/17,2 % après 5 ans de détention/)).toBeInTheDocument();

        rerender(<SingleEnvelopeSimulator defaults={defaults} jurisdiction="france" wrapper="cto" />);

        expect(screen.getByText(/prélèvement forfaitaire unique de 30 %/)).toBeInTheDocument();
    });
});
