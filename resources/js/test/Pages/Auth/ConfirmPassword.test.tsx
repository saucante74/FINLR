import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import ConfirmPassword from '@/Pages/Auth/ConfirmPassword';

describe('ConfirmPassword page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the password field and submit button', () => {
        render(<ConfirmPassword />);

        expect(
            screen.getByLabelText(i18n.t('auth.confirmPassword.password')),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: i18n.t('auth.confirmPassword.submit'),
            }),
        ).toBeInTheDocument();
    });

    it('toggles password visibility', async () => {
        const user = userEvent.setup();
        render(<ConfirmPassword />);

        const password = screen.getByLabelText(
            i18n.t('auth.confirmPassword.password'),
        );
        expect(password).toHaveAttribute('type', 'password');

        await user.click(
            screen.getByRole('button', {
                name: i18n.t('auth.confirmPassword.showPassword'),
            }),
        );

        expect(password).toHaveAttribute('type', 'text');
    });
});
