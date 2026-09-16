import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import ApplicationLogo from '@/components/ApplicationLogo';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { NAV_SECTION_IDS } from '@/features/landing/constants';
import type { LandingPageProps } from '@/features/landing/types';

/**
 * Landing-specific header: unlike the application Navbar, its nav links are
 * in-page anchors to the sections listed in NAV_SECTION_IDS, and its primary
 * action is the sign-up CTA. Language and theme controls are kept because
 * this page is the project's public entry point.
 */
export default function LandingHeader({ canLogin, canRegister }: LandingPageProps) {
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
            {/* flex-wrap, not a mobile menu: on a phone the logo keeps the first
                row and the controls drop to a second one, so the language, theme
                and sign-up controls all stay reachable without overflowing. */}
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 lg:px-8">
                <Link
                    href={route('home')}
                    className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
                >
                    <ApplicationLogo className="size-10" />
                    <span className="text-xl">{t('nav.brand')}</span>
                </Link>

                <nav
                    aria-label={t('landing.nav.ariaLabel')}
                    className="hidden items-center gap-6 md:flex"
                >
                    {NAV_SECTION_IDS.map((id) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t(`landing.nav.${id}`)}
                        </a>
                    ))}
                </nav>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <LanguageSelector />
                    <ThemeToggle />

                    {canLogin && (
                        <Link
                            href={route('login')}
                            className="hidden shrink-0 px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                        >
                            {t('landing.nav.login')}
                        </Link>
                    )}

                    {canRegister && (
                        <Button asChild variant="brand" size="lg" className="shrink-0">
                            <Link href={route('register')}>{t('landing.nav.cta')}</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
