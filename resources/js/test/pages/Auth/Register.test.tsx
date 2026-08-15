import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import Register from '@/pages/Auth/Register';

describe('Register page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders name, email, password and password confirmation fields', () => {
        render(<Register />);

        expect(
            screen.getByLabelText(i18n.t('auth.register.name')),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(i18n.t('auth.register.email')),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(i18n.t('auth.register.password')),
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(
                i18n.t('auth.register.passwordConfirmation'),
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: i18n.t('auth.register.submit'),
            }),
        ).toBeInTheDocument();
    });

    it('links to the login page', () => {
        render(<Register />);

        expect(
            screen.getByRole('link', {
                name: i18n.t('auth.register.loginLink'),
            }),
        ).toHaveAttribute('href', '/login');
    });

    it('lets the user fill in the registration form', async () => {
        const user = userEvent.setup();
        render(<Register />);

        const name = screen.getByLabelText(i18n.t('auth.register.name'));
        const email = screen.getByLabelText(i18n.t('auth.register.email'));

        await user.type(name, 'Jane Doe');
        await user.type(email, 'jane@example.com');

        expect(name).toHaveValue('Jane Doe');
        expect(email).toHaveValue('jane@example.com');
    });

    it('toggles visibility independently for password and confirmation fields', async () => {
        const user = userEvent.setup();
        render(<Register />);

        const password = screen.getByLabelText(
            i18n.t('auth.register.password'),
        );
        const confirmation = screen.getByLabelText(
            i18n.t('auth.register.passwordConfirmation'),
        );
        const [passwordToggle, confirmationToggle] = screen.getAllByRole(
            'button',
            { name: i18n.t('auth.register.showPassword') },
        );

        expect(password).toHaveAttribute('type', 'password');
        expect(confirmation).toHaveAttribute('type', 'password');

        await user.click(passwordToggle);

        expect(password).toHaveAttribute('type', 'text');
        expect(confirmation).toHaveAttribute('type', 'password');

        await user.click(confirmationToggle);

        expect(confirmation).toHaveAttribute('type', 'text');
    });
});
