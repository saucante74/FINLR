import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

const postMock = vi.fn();
let submittedPeriod: unknown = null;

vi.mock('@inertiajs/react', () => ({
    useForm: (initialValues: Record<string, unknown>) => {
        const [data, setDataState] = useState(initialValues);
        submittedPeriod = data.period;

        return {
            data,
            setData: (key: string, value: unknown) => setDataState((prev) => ({ ...prev, [key]: value })),
            post: postMock,
            processing: false,
        };
    },
}));

import PremiumCheckoutForm from '@/features/subscriptions/components/PremiumCheckoutForm';

describe('PremiumCheckoutForm', () => {
    beforeEach(async () => {
        postMock.mockClear();
        await i18n.changeLanguage('fr');
    });

    it('selects the monthly period by default', () => {
        render(<PremiumCheckoutForm />);

        expect(screen.getByRole('button', { name: i18n.t('dashboard.promo.periods.monthly') })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
    });

    it('lets the user switch to the yearly period before checkout', async () => {
        const user = userEvent.setup();
        render(<PremiumCheckoutForm />);

        await user.click(screen.getByRole('button', { name: i18n.t('dashboard.promo.periods.yearly') }));

        expect(screen.getByRole('button', { name: i18n.t('dashboard.promo.periods.yearly') })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
        expect(submittedPeriod).toBe('yearly');
    });

    it('posts the chosen period to the checkout route', async () => {
        const user = userEvent.setup();
        render(<PremiumCheckoutForm />);

        await user.click(screen.getByRole('button', { name: i18n.t('dashboard.promo.periods.yearly') }));
        await user.click(screen.getByRole('button', { name: i18n.t('dashboard.promo.cta') }));

        expect(postMock).toHaveBeenCalledWith(route('billing.checkout'));
        expect(submittedPeriod).toBe('yearly');
    });

    it('groups the period choice under an accessible label', () => {
        render(<PremiumCheckoutForm />);

        expect(screen.getByRole('group', { name: i18n.t('dashboard.promo.periodLabel') })).toBeInTheDocument();
    });
});
