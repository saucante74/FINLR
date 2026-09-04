import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

import EnvelopeRow from '@/features/multi-envelope-simulator/components/EnvelopeRow';
import type { AccountType, EnvelopeFormValues } from '@/features/multi-envelope-simulator/types';

const accountTypes: AccountType[] = ['PEA', 'PEA_PME', 'CTO', 'ASSURANCE_VIE', 'CAT', 'LIVRET_A', 'LDDS', 'COMPTE_COURANT'];

const values: EnvelopeFormValues = {
    accountType: 'PEA',
    initialAmount: 1000,
    monthlyContribution: 200,
    durationYears: 15,
    annualReturnRate: 6,
    managementFeeRate: 0.5,
};

describe('EnvelopeRow', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the envelope index, account type and every field prefilled', () => {
        render(
            <EnvelopeRow
                index={0}
                accountTypes={accountTypes}
                values={values}
                errors={{}}
                canRemove
                onChange={vi.fn()}
                onRemove={vi.fn()}
            />,
        );

        expect(screen.getByText(i18n.t('simulator.multiEnvelope.form.envelopeLabel', { index: 1 }))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('simulator.multiEnvelope.accountTypes.PEA'))).toBeInTheDocument();
        expect(screen.getByLabelText(i18n.t('simulator.multiEnvelope.form.fields.initialAmount.label'))).toHaveValue(1000);
        expect(
            screen.getByLabelText(i18n.t('simulator.multiEnvelope.form.fields.monthlyContribution.label')),
        ).toHaveValue(200);
        expect(screen.getByLabelText(i18n.t('simulator.multiEnvelope.form.fields.durationYears.label'))).toHaveValue(15);
        expect(
            screen.getByLabelText(i18n.t('simulator.multiEnvelope.form.fields.annualReturnRate.label')),
        ).toHaveValue(6);
        expect(
            screen.getByLabelText(i18n.t('simulator.multiEnvelope.form.fields.managementFeeRate.label')),
        ).toHaveValue(0.5);
    });

    it('shows the error tied to a field, keyed by its dotted path', () => {
        render(
            <EnvelopeRow
                index={2}
                accountTypes={accountTypes}
                values={values}
                errors={{ 'envelopes.2.durationYears': 'Doit être compris entre 1 et 60.' }}
                canRemove
                onChange={vi.fn()}
                onRemove={vi.fn()}
            />,
        );

        expect(screen.getByText('Doit être compris entre 1 et 60.')).toBeInTheDocument();
    });

    it('calls onChange with the field key and numeric value when a field is edited', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <EnvelopeRow
                index={0}
                accountTypes={accountTypes}
                values={values}
                errors={{}}
                canRemove
                onChange={onChange}
                onRemove={vi.fn()}
            />,
        );

        await user.type(screen.getByLabelText(i18n.t('simulator.multiEnvelope.form.fields.initialAmount.label')), '5');

        expect(onChange).toHaveBeenCalledWith('initialAmount', 10005);
    });

    it('renders no remove button when canRemove is false', () => {
        render(
            <EnvelopeRow
                index={0}
                accountTypes={accountTypes}
                values={values}
                errors={{}}
                canRemove={false}
                onChange={vi.fn()}
                onRemove={vi.fn()}
            />,
        );

        expect(
            screen.queryByRole('button', { name: i18n.t('simulator.multiEnvelope.form.removeEnvelope', { index: 1 }) }),
        ).not.toBeInTheDocument();
    });

    it('calls onRemove when the remove button is clicked', async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();
        render(
            <EnvelopeRow
                index={0}
                accountTypes={accountTypes}
                values={values}
                errors={{}}
                canRemove
                onChange={vi.fn()}
                onRemove={onRemove}
            />,
        );

        await user.click(
            screen.getByRole('button', { name: i18n.t('simulator.multiEnvelope.form.removeEnvelope', { index: 1 }) }),
        );

        expect(onRemove).toHaveBeenCalledOnce();
    });
});
