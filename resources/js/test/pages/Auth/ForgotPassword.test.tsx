import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import ForgotPassword from '@/pages/Auth/ForgotPassword';

describe('ForgotPassword page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the email field, submit button and login link', () => {
        render(<ForgotPassword status={null} />);

        expect(
            screen.getByLabelText(i18n.t('auth.forgotPassword.email')),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: i18n.t('auth.forgotPassword.submit'),
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', {
                name: i18n.t('auth.forgotPassword.backToLogin'),
            }),
        ).toHaveAttribute('href', '/login');
    });

    it('lets the user type an email', async () => {
        const user = userEvent.setup();
        render(<ForgotPassword status={null} />);

        const email = screen.getByLabelText(
            i18n.t('auth.forgotPassword.email'),
        );
        await user.type(email, 'jane@example.com');

        expect(email).toHaveValue('jane@example.com');
    });

    it('displays the status message when present', () => {
        render(<ForgotPassword status="Lien envoyé." />);

        expect(screen.getByText('Lien envoyé.')).toBeInTheDocument();
    });
});
