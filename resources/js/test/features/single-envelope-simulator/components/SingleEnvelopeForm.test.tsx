import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

const postMock = vi.fn();

vi.mock('@inertiajs/react', () => ({
    useForm: (initialValues: Record<string, unknown>) => ({
        data: initialValues,
        setData: vi.fn(),
        post: postMock,
        processing: false,
        errors: {},
    }),
}));

import SingleEnvelopeForm from '@/features/single-envelope-simulator/components/SingleEnvelopeForm';
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

describe('SingleEnvelopeForm', () => {
    beforeEach(async () => {
        postMock.mockClear();
        await i18n.changeLanguage('fr');
    });

    it('renders the ten fields, prefilled with the default values from props', () => {
        render(<SingleEnvelopeForm defaults={defaults} jurisdiction="france" wrapper="pea" />);

        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.name')),
        ).toHaveValue('');
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.initialCapital')),
        ).toHaveValue(10000);
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.monthlyContribution')),
        ).toHaveValue(300);
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.annualRate')),
        ).toHaveValue(6);
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.years')),
        ).toHaveValue(15);
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.wrapperFee')),
        ).toHaveValue(0.5);
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.fundFee')),
        ).toHaveValue(0.3);
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.taxRate')),
        ).toHaveValue(30);
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.inflationRate')),
        ).toHaveValue(2);
        expect(
            screen.getByLabelText(i18n.t('simulator.singleEnvelope.form.inflationEnabled')),
        ).not.toBeChecked();
    });

    it('shows the URL-provided wrapper as read-only text, not as a form control', () => {
        render(<SingleEnvelopeForm defaults={defaults} jurisdiction="france" wrapper="pea" />);

        expect(
            screen.getByText(i18n.t('simulator.singleEnvelope.form.wrapperOptions.pea')),
        ).toBeInTheDocument();
        expect(
            screen.queryByLabelText(i18n.t('simulator.singleEnvelope.form.wrapper')),
        ).not.toBeInTheDocument();
    });

    it('disables the submit button while the form is processing', () => {
        render(<SingleEnvelopeForm defaults={defaults} jurisdiction="france" wrapper="pea" />);

        expect(
            screen.getByRole('button', { name: i18n.t('simulator.singleEnvelope.form.submit') }),
        ).toBeEnabled();
    });

    it('posts to the single-envelope run route on submit', async () => {
        const user = userEvent.setup();
        render(<SingleEnvelopeForm defaults={defaults} jurisdiction="france" wrapper="pea" />);

        await user.click(
            screen.getByRole('button', { name: i18n.t('simulator.singleEnvelope.form.submit') }),
        );

        expect(postMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledWith(route('simulators.single-envelope.run', { jurisdiction: 'france', wrapper: 'pea' }));
    });
});
