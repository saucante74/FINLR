import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import FireSimulator from '@/pages/simulator/FireSimulator';

const defaults = {
    currentAge: 30,
    currentCapital: 10_000,
    monthlyContribution: 500,
    annualReturnRate: 6,
    desiredAnnualIncome: 24_000,
    withdrawalRate: 4,
};

describe('FireSimulator', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the heading and the form', () => {
        render(<FireSimulator defaults={defaults} />);

        expect(
            screen.getByRole('heading', { level: 1, name: i18n.t('simulator.fire.title') }),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: i18n.t('simulator.fire.form.submit') })).toBeInTheDocument();
    });
});
