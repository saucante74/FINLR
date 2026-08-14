import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import ResetPassword from '@/Pages/Auth/ResetPassword';

describe('ResetPassword page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the email, password and confirmation fields prefilled', () => {
        render(<ResetPassword token="abc" email="jane@example.com" />);

        expect(
            screen.getByLabelText(i18n.t('auth.resetPassword.email')),
        ).toHaveValue('jane@example.com');
        expect(
            screen.getByLabelText(i18n.t('auth.resetPassword.password')),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(
                i18n.t('auth.resetPassword.passwordConfirmation'),
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: i18n.t('auth.resetPassword.submit'),
            }),
        ).toBeInTheDocument();
    });

    it('toggles password visibility independently for both password fields', async () => {
        const user = userEvent.setup();
        render(<ResetPassword token="abc" email="jane@example.com" />);

        const password = screen.getByLabelText(
            i18n.t('auth.resetPassword.password'),
        );
        const confirmation = screen.getByLabelText(
            i18n.t('auth.resetPassword.passwordConfirmation'),
        );
        expect(password).toHaveAttribute('type', 'password');
        expect(confirmation).toHaveAttribute('type', 'password');

        const [showPasswordButton] = screen.getAllByRole('button', {
            name: i18n.t('auth.resetPassword.showPassword'),
        });
        await user.click(showPasswordButton);

        expect(password).toHaveAttribute('type', 'text');
        expect(confirmation).toHaveAttribute('type', 'password');
    });
});
