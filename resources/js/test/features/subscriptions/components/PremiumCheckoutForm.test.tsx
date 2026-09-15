import { act, fireEvent, render, screen } from '@testing-library/react';
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

        expect(postMock).toHaveBeenCalledWith(route('billing.checkout'), expect.anything());
        expect(submittedPeriod).toBe('yearly');
    });

    it('groups the period choice under an accessible label', () => {
        render(<PremiumCheckoutForm />);

        expect(screen.getByRole('group', { name: i18n.t('dashboard.promo.periodLabel') })).toBeInTheDocument();
    });

    it('submits only once when the form is sent twice in a row', () => {
        render(<PremiumCheckoutForm />);
        const button = screen.getByRole('button', { name: i18n.t('dashboard.promo.cta') });

        // Two synchronous submits: the second one lands before any re-render.
        fireEvent.submit(button.closest('form') as HTMLFormElement);
        fireEvent.submit(button.closest('form') as HTMLFormElement);

        expect(postMock).toHaveBeenCalledTimes(1);
        expect(button).toBeDisabled();
    });

    it('unlocks the button when the server rejects the request', () => {
        render(<PremiumCheckoutForm />);
        const button = screen.getByRole('button', { name: i18n.t('dashboard.promo.cta') });

        fireEvent.submit(button.closest('form') as HTMLFormElement);
        const options = postMock.mock.calls[0][1] as { onError: () => void };
        act(() => options.onError());

        expect(button).toBeEnabled();
    });

    it('unlocks the button when the page is restored from the back/forward cache', () => {
        render(<PremiumCheckoutForm />);
        const button = screen.getByRole('button', { name: i18n.t('dashboard.promo.cta') });

        fireEvent.submit(button.closest('form') as HTMLFormElement);
        act(() => {
            window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
        });

        expect(button).toBeEnabled();
    });
});
