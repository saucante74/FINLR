import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import * as inertia from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

describe('Navbar', () => {
    beforeEach(async () => {
        localStorage.clear();
        document.documentElement.classList.remove('dark');
        await i18n.changeLanguage('fr');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the brand, language selector and theme toggle', () => {
        render(<Navbar canLogin={true} canRegister={true} />);

        expect(screen.getByText('Finlr')).toBeInTheDocument();
        expect(
            screen.getByRole('group', { name: i18n.t('nav.language') }),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'fr' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'en' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'it' })).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: i18n.t('nav.toggleTheme') }),
        ).toBeInTheDocument();
    });

    it('shows login and register links when enabled', () => {
        render(<Navbar canLogin={true} canRegister={true} />);

        expect(
            screen.getByRole('link', { name: i18n.t('nav.login') }),
        ).toHaveAttribute('href', '/login');
        expect(
            screen.getByRole('link', { name: i18n.t('nav.register') }),
        ).toHaveAttribute('href', '/register');
    });

    it('hides login/register links when disabled', () => {
        render(<Navbar canLogin={false} canRegister={false} />);

        expect(
            screen.queryByRole('link', { name: i18n.t('nav.login') }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: i18n.t('nav.register') }),
        ).not.toBeInTheDocument();
    });

    it('switches the active language when a language button is clicked', async () => {
        const user = userEvent.setup();
        render(<Navbar canLogin={false} canRegister={false} />);

        await user.click(screen.getByRole('button', { name: 'en' }));

        expect(i18n.resolvedLanguage).toBe('en');
        expect(
            screen.getByRole('button', { name: 'en' }),
        ).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows the profile link and logout button when authenticated', () => {
        vi.spyOn(inertia, 'usePage').mockReturnValue({
            props: {
                auth: {
                    user: {
                        id: 1,
                        name: 'Jane Doe',
                        email: 'jane@example.com',
                        email_verified_at: null,
                        subscription_plan: 'free',
                    },
                    plan: 'free',
                    permissions: [],
                },
            },
        } as unknown as ReturnType<typeof inertia.usePage>);

        render(<Navbar canLogin={true} canRegister={true} />);

        expect(
            screen.getByRole('link', { name: i18n.t('nav.profile') }),
        ).toHaveAttribute('href', '/profile.edit');
        expect(
            screen.getByRole('link', { name: i18n.t('nav.logout') }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: i18n.t('nav.login') }),
        ).not.toBeInTheDocument();
    });

    it('toggles the dark class on the html element', async () => {
        const user = userEvent.setup();
        render(<Navbar canLogin={false} canRegister={false} />);

        expect(document.documentElement.classList.contains('dark')).toBe(
            false,
        );

        await user.click(
            screen.getByRole('button', { name: i18n.t('nav.toggleTheme') }),
        );

        expect(document.documentElement.classList.contains('dark')).toBe(
            true,
        );
    });
});
