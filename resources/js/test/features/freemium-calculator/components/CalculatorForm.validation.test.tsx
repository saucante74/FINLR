import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

import CalculatorForm from '@/features/freemium-calculator/components/CalculatorForm';
import type { CompoundInputs } from '@/features/freemium-calculator/types';

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

describe('CalculatorForm validation', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('shows an error for an out-of-range years value, once touched, without breaking the render', async () => {
        render(<CalculatorForm inputs={inputs} onChange={vi.fn()} taxSuggestions={[]} />);

        const yearsInput = screen.getByLabelText(i18n.t('form.years'));

        // fireEvent.change sets the full string atomically; userEvent.type would
        // type "-" then "5" character by character, and a native number input
        // discards a lone "-" as an invalid intermediate value.
        fireEvent.change(yearsInput, { target: { value: '-5' } });
        fireEvent.blur(yearsInput);

        expect(
            await screen.findByText(i18n.t('form.errors.yearsRange')),
        ).toBeInTheDocument();

        // The field and the rest of the form are still rendered: an invalid
        // value shows an error, it does not unmount or crash the form.
        expect(yearsInput).toBeInTheDocument();
        expect(
            screen.getByLabelText(i18n.t('form.initialCapital')),
        ).toBeInTheDocument();
    });

    it('does not show the years error before the field has been touched', () => {
        render(<CalculatorForm inputs={inputs} onChange={vi.fn()} taxSuggestions={[]} />);

        const yearsInput = screen.getByLabelText(i18n.t('form.years'));
        fireEvent.change(yearsInput, { target: { value: '-5' } });

        expect(screen.queryByText(i18n.t('form.errors.yearsRange'))).not.toBeInTheDocument();
    });
});
