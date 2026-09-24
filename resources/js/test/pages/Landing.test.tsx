import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import Landing from '@/pages/Landing';

describe('Landing', () => {
    beforeEach(async () => {
        vi.restoreAllMocks();
        localStorage.clear();
        await i18n.changeLanguage('fr');
    });

    it('renders the hero headline and its description', () => {
        render(<Landing canLogin={true} canRegister={true} />);

        expect(
            screen.getByRole('heading', { level: 1, name: i18n.t('landing.hero.title') }),
        ).toBeInTheDocument();
        expect(screen.getByText(i18n.t('landing.hero.description'))).toBeInTheDocument();
    });

    it('points every sign-up call to action at the register route', () => {
        render(<Landing canLogin={true} canRegister={true} />);

        const signUpLinks = screen.getAllByRole('link', {
            name: new RegExp(
                `${i18n.t('landing.hero.ctaPrimary')}|${i18n.t('landing.pricing.plans.free.cta')}|${i18n.t('landing.pricing.plans.premium.cta')}`,
            ),
        });

        expect(signUpLinks.length).toBeGreaterThan(0);
        signUpLinks.forEach((link) => expect(link).toHaveAttribute('href', route('register')));
    });

    it('sends the demo call to action to the freemium calculator', () => {
        render(<Landing canLogin={true} canRegister={true} />);

        expect(
            screen.getByRole('link', { name: i18n.t('landing.hero.ctaSecondary') }),
        ).toHaveAttribute('href', route('calculator.freemium'));
    });

    it('links the header to the login route and hides it when login is closed', () => {
        const { unmount } = render(<Landing canLogin={true} canRegister={true} />);

        expect(
            screen.getByRole('link', { name: i18n.t('landing.nav.login') }),
        ).toHaveAttribute('href', route('login'));

        unmount();
        render(<Landing canLogin={false} canRegister={false} />);

        expect(
            screen.queryByRole('link', { name: i18n.t('landing.nav.login') }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: i18n.t('landing.hero.ctaPrimary') }),
        ).not.toBeInTheDocument();
    });

    it('anchors the header nav to the sections rendered on the page', () => {
        const { container } = render(<Landing canLogin={true} canRegister={true} />);

        (['why', 'simulators', 'pricing', 'faq'] as const).forEach((id) => {
            expect(
                screen.getByRole('link', { name: i18n.t(`landing.nav.${id}`) }),
            ).toHaveAttribute('href', `#${id}`);
            expect(container.querySelector(`section#${id}`)).not.toBeNull();
        });
    });

    it('opens the first FAQ answer and closes it on click', async () => {
        const user = userEvent.setup();
        render(<Landing canLogin={true} canRegister={true} />);

        const firstQuestion = screen.getByRole('button', {
            name: i18n.t('landing.faq.items.security.question'),
        });

        expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText(i18n.t('landing.faq.items.security.answer'))).toBeVisible();

        await user.click(firstQuestion);

        expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
        expect(
            screen.getByText(i18n.t('landing.faq.items.security.answer')),
        ).not.toBeVisible();
    });

    it('opens another FAQ answer and closes the previous one', async () => {
        const user = userEvent.setup();
        render(<Landing canLogin={true} canRegister={true} />);

        await user.click(
            screen.getByRole('button', { name: i18n.t('landing.faq.items.cancel.question') }),
        );

        expect(
            screen.getByRole('button', { name: i18n.t('landing.faq.items.cancel.question') }),
        ).toHaveAttribute('aria-expanded', 'true');
        expect(
            screen.getByRole('button', { name: i18n.t('landing.faq.items.security.question') }),
        ).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows no subscription amount in the premium plan', () => {
        render(<Landing canLogin={true} canRegister={true} />);

        // Amounts live only in Stripe (CLAUDE.md): the premium card shows a
        // note instead of a price, and no "€" figure other than the free plan's.
        expect(
            screen.getByText(i18n.t('landing.pricing.plans.premium.priceNote')),
        ).toBeInTheDocument();
        expect(screen.getAllByText(/€/).map((node) => node.textContent)).toEqual([
            i18n.t('landing.hero.preview.amount'),
            i18n.t('landing.hero.preview.comparisonAmount'),
            i18n.t('landing.pricing.plans.free.price'),
        ]);
    });
});
