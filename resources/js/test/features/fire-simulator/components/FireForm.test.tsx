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

import FireForm from '@/features/fire-simulator/components/FireForm';
import type { FireSimulatorDefaults } from '@/features/fire-simulator/types';

const defaults: FireSimulatorDefaults = {
    currentAge: 30,
    currentCapital: 10_000,
    monthlyContribution: 500,
    annualReturnRate: 6,
    desiredAnnualIncome: 24_000,
    withdrawalRate: 4,
};

describe('FireForm', () => {
    beforeEach(async () => {
        postMock.mockClear();
        await i18n.changeLanguage('fr');
    });

    it('renders the single input block, prefilled from the given defaults', () => {
        render(<FireForm defaults={defaults} />);

        expect(screen.getByText(i18n.t('simulator.fire.form.sections.inputs'))).toBeInTheDocument();
        expect(
            screen.getByLabelText(i18n.t('simulator.fire.form.fields.monthlyContribution.label')),
        ).toHaveValue(500);
        expect(
            screen.getByLabelText(i18n.t('simulator.fire.form.fields.desiredAnnualIncome.label')),
        ).toHaveValue(24_000);
    });

    it('renders currentCapital before currentAge, per FIELD_ORDER', () => {
        render(<FireForm defaults={defaults} />);

        const capitalLabel = screen.getByText(i18n.t('simulator.fire.form.fields.currentCapital.label'));
        const ageLabel = screen.getByText(i18n.t('simulator.fire.form.fields.currentAge.label'));

        // compareDocumentPosition's DOCUMENT_POSITION_FOLLOWING bit (4) means
        // ageLabel comes after capitalLabel in the DOM.
        expect(capitalLabel.compareDocumentPosition(ageLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('does not render an envelope/account type selector', () => {
        render(<FireForm defaults={defaults} />);

        expect(screen.queryByText(i18n.t('simulator.analogy.form.accountType'))).not.toBeInTheDocument();
    });

    it('submits to the fire run route', async () => {
        const user = userEvent.setup();
        render(<FireForm defaults={defaults} />);

        await user.click(screen.getByRole('button', { name: i18n.t('simulator.fire.form.submit') }));

        expect(postMock).toHaveBeenCalledWith('/simulators.fire.run');
    });
});
