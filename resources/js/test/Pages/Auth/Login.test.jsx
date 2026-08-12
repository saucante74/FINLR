import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import Login from '@/Pages/Auth/Login';

describe('Login page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the email and password fields, remember me and submit button', () => {
        render(<Login status={null} canResetPassword={true} />);

        expect(
            screen.getByLabelText(i18n.t('auth.login.email')),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(i18n.t('auth.login.password')),
        ).toBeInTheDocument();
        expect(
            screen.getByText(i18n.t('auth.login.rememberMe')),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: i18n.t('auth.login.submit') }),
        ).toBeInTheDocument();
    });

    it('shows the forgot password link only when canResetPassword is true', () => {
        const { rerender } = render(
            <Login status={null} canResetPassword={true} />,
        );
        expect(
            screen.getByRole('link', {
                name: i18n.t('auth.login.forgotPassword'),
            }),
        ).toBeInTheDocument();

        rerender(<Login status={null} canResetPassword={false} />);
        expect(
            screen.queryByRole('link', {
                name: i18n.t('auth.login.forgotPassword'),
            }),
        ).not.toBeInTheDocument();
    });

    it('links to the register page', () => {
        render(<Login status={null} canResetPassword={true} />);

        const paragraph = screen
            .getByText(i18n.t('auth.login.noAccount'), { exact: false })
            .closest('p');

        expect(
            within(paragraph).getByRole('link', {
                name: i18n.t('auth.login.registerLink'),
            }),
        ).toHaveAttribute('href', '/register');
    });

    it('lets the user type into the email and password fields', async () => {
        const user = userEvent.setup();
        render(<Login status={null} canResetPassword={true} />);

        const email = screen.getByLabelText(i18n.t('auth.login.email'));
        const password = screen.getByLabelText(i18n.t('auth.login.password'));

        await user.type(email, 'jane@example.com');
        await user.type(password, 'secret123');

        expect(email).toHaveValue('jane@example.com');
        expect(password).toHaveValue('secret123');
    });

    it('toggles password visibility', async () => {
        const user = userEvent.setup();
        render(<Login status={null} canResetPassword={true} />);

        const password = screen.getByLabelText(i18n.t('auth.login.password'));
        expect(password).toHaveAttribute('type', 'password');

        await user.click(
            screen.getByRole('button', {
                name: i18n.t('auth.login.showPassword'),
            }),
        );

        expect(password).toHaveAttribute('type', 'text');
    });

    it('displays the status message when present', () => {
        render(
            <Login
                status="Un lien de vérification vient d'être envoyé."
                canResetPassword={true}
            />,
        );

        expect(
            screen.getByText("Un lien de vérification vient d'être envoyé."),
        ).toBeInTheDocument();
    });
});
