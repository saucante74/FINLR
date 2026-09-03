import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import AnalogySimulator from '@/pages/simulator/AnalogySimulator';
import type { AccountType } from '@/features/analogy-simulator/types';

const accountTypes: AccountType[] = ['PEA', 'PEA_PME', 'CTO', 'ASSURANCE_VIE', 'CAT', 'LIVRET_A', 'LDDS', 'COMPTE_COURANT'];

const defaults = {
    initialAmount: 0,
    monthlyContribution: 1000,
    durationYears: 20,
    annualReturnRate: 6,
    managementFeeRate: 0,
    inflationRate: 2,
};

describe('AnalogySimulator', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the heading and the form', () => {
        render(<AnalogySimulator defaults={defaults} accountTypes={accountTypes} />);

        expect(
            screen.getByRole('heading', { level: 1, name: i18n.t('simulator.analogy.title') }),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: i18n.t('simulator.analogy.form.submit') })).toBeInTheDocument();
    });
});
