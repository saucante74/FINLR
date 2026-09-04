import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

import AmountField from '@/components/form/AmountField';

describe('AmountField', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the label, value and help text', () => {
        render(
            <AmountField
                fieldKey="initialAmount"
                label="Montant initial"
                helpText="Apport initial"
                value={1000}
                step={100}
                onChange={vi.fn()}
            />,
        );

        expect(screen.getByLabelText('Montant initial')).toHaveValue(1000);
        expect(screen.getByText('Apport initial')).toBeInTheDocument();
    });

    it('shows the error message instead of the help text when given', () => {
        render(
            <AmountField
                fieldKey="initialAmount"
                label="Montant initial"
                helpText="Apport initial"
                value={1000}
                step={100}
                error="Ce champ est requis."
                onChange={vi.fn()}
            />,
        );

        expect(screen.getByText('Ce champ est requis.')).toBeInTheDocument();
        expect(screen.queryByText('Apport initial')).not.toBeInTheDocument();
        expect(screen.getByLabelText('Montant initial')).toHaveAttribute('aria-invalid', 'true');
    });

    it('calls onChange with the numeric value when edited', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <AmountField
                fieldKey="initialAmount"
                label="Montant initial"
                helpText="Apport initial"
                value={0}
                step={100}
                onChange={onChange}
            />,
        );

        await user.type(screen.getByLabelText('Montant initial'), '5');

        expect(onChange).toHaveBeenCalledWith(5);
    });
});
