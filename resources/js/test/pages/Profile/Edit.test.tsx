import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import * as inertia from '@inertiajs/react';
import Edit from '@/pages/Profile/Edit';

const user = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    email_verified_at: '2024-01-01T00:00:00.000Z',
};

describe('Profile Edit page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
        vi.spyOn(inertia, 'usePage').mockReturnValue({
            props: { auth: { user, plan: 'free', permissions: [] } },
        } as unknown as ReturnType<typeof inertia.usePage>);
    });

    it('renders the profile information, password and delete account sections', () => {
        render(<Edit mustVerifyEmail={true} status={null} />);

        expect(
            screen.getByText(i18n.t('profile.information.title')),
        ).toBeInTheDocument();
        expect(
            screen.getByText(i18n.t('profile.password.title')),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: i18n.t('profile.deleteAccount.button'),
            }),
        ).toBeInTheDocument();
    });

    it('prefills the name and email fields from the current user', () => {
        render(<Edit mustVerifyEmail={true} status={null} />);

        expect(
            screen.getByLabelText(i18n.t('profile.information.name')),
        ).toHaveValue('Jane Doe');
        expect(
            screen.getByLabelText(i18n.t('profile.information.email')),
        ).toHaveValue('jane@example.com');
    });

    it('opens the delete account confirmation modal', async () => {
        const testUser = userEvent.setup();
        render(<Edit mustVerifyEmail={true} status={null} />);

        await testUser.click(
            screen.getByRole('button', {
                name: i18n.t('profile.deleteAccount.button'),
            }),
        );

        expect(
            screen.getByText(i18n.t('profile.deleteAccount.confirmTitle')),
        ).toBeInTheDocument();
    });
});
