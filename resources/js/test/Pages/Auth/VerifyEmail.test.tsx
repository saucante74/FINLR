import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import VerifyEmail from '@/Pages/Auth/VerifyEmail';

describe('VerifyEmail page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the resend button and logout link', () => {
        render(<VerifyEmail status={null} />);

        expect(
            screen.getByRole('button', {
                name: i18n.t('auth.verifyEmail.resend'),
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', {
                name: i18n.t('auth.verifyEmail.logout'),
            }),
        ).toHaveAttribute('href', '/logout');
    });

    it('shows the sent-status banner only when status is verification-link-sent', () => {
        const { rerender } = render(<VerifyEmail status={null} />);
        expect(
            screen.queryByText(i18n.t('auth.verifyEmail.statusSent')),
        ).not.toBeInTheDocument();

        rerender(<VerifyEmail status="verification-link-sent" />);
        expect(
            screen.getByText(i18n.t('auth.verifyEmail.statusSent')),
        ).toBeInTheDocument();
    });
});
