import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

import CalculatorForm from '@/Components/calculator/CalculatorForm';
import type { CompoundInputs } from '@/lib/compound';

const inputs: CompoundInputs = {
    initialCapital: 1000,
    monthlyContribution: 100,
    annualRate: 5,
    years: 10,
    wrapperFee: 0.5,
    fundFee: 0.3,
    taxRate: 30,
    inflationRate: 2,
    inflationEnabled: false,
};

describe('CalculatorForm', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('labels the fund fee field "Frais de gestion"', () => {
        render(
            <CalculatorForm inputs={inputs} onChange={vi.fn()} taxSuggestions={[]} />,
        );

        expect(screen.getByLabelText(/Frais de gestion/)).toBeInTheDocument();
    });

    it('shows an info tooltip on the wrapper fee and fund fee labels', () => {
        render(
            <CalculatorForm inputs={inputs} onChange={vi.fn()} taxSuggestions={[]} />,
        );

        expect(
            screen.getByTitle(i18n.t('form.wrapperFeeInfo')),
        ).toBeInTheDocument();
        expect(
            screen.getByTitle(i18n.t('form.fundFeeInfo')),
        ).toBeInTheDocument();
    });
});
