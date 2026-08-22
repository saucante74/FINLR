import { Link, usePage } from '@inertiajs/react';
import { Moon, Sun, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import ApplicationLogo from '@/components/ApplicationLogo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useDarkMode from '@/hooks/useDarkMode';
import type { PageProps } from '@/types';

const LOCALES = ['fr', 'en', 'it'] as const;

function LanguageSelector() {
    const { t, i18n } = useTranslation();

    return (
        <div
            role="group"
            aria-label={t('nav.language')}
            className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5"
        >
            {LOCALES.map((locale) => {
                const active = i18n.resolvedLanguage === locale;
                return (
                    <button
                        key={locale}
                        type="button"
                        onClick={() => i18n.changeLanguage(locale)}
                        aria-pressed={active}
                        className={cn(
                            'rounded-full px-2 py-1 text-xs font-medium uppercase transition-colors',
                            active
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        {locale}
                    </button>
                );
            })}
        </div>
    );
}

function ThemeToggle() {
    const { t } = useTranslation();
    const { isDark, toggleTheme } = useDarkMode();

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t('nav.toggleTheme')}
            onClick={toggleTheme}
        >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    );
}

interface NavbarProps {
    canLogin?: boolean;
    canRegister?: boolean;
}

function isCurrentPath(url: string | undefined, routeName: string): boolean {
    const origin = window.location.origin;
    const currentPath = new URL(url ?? '', origin).pathname;
    const routePath = new URL(route(routeName), origin).pathname;

    return currentPath === routePath;
}

function getInitials(name: string): string {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('') || '?'
    );
}

const TAB_CLASSES = 'rounded-full px-3 py-1.5 text-sm font-medium transition-colors';

export default function Navbar({ canLogin, canRegister }: NavbarProps) {
    const { t } = useTranslation();
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const user = auth?.user ?? null;
    const isDashboardPage = isCurrentPath(page.url, 'dashboard');

    return (
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link
                        href={route('calculator.freemium')}
                        className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
                    >
                        <ApplicationLogo className="size-12" />
                        <span className="text-2xl">{t('nav.brand')}</span>
                    </Link>

                    {user && (
                        <nav className="hidden items-center gap-1 md:flex">
                            <Link
                                href={route('dashboard')}
                                aria-current={isDashboardPage ? 'page' : undefined}
                                className={cn(
                                    TAB_CLASSES,
                                    isDashboardPage
                                        ? 'bg-muted text-foreground'
                                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                                )}
                            >
                                {t('nav.dashboard')}
                            </Link>
                            <span className={cn(TAB_CLASSES, 'text-muted-foreground')}>
                                {t('nav.simulators')}
                            </span>
                            <span className={cn(TAB_CLASSES, 'text-muted-foreground')}>
                                {t('nav.resources')}
                            </span>
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="hidden items-center gap-2 sm:flex">
                                <span
                                    aria-hidden
                                    className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-semibold text-brand-foreground"
                                >
                                    {getInitials(user.name || user.email)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {user.name || user.email}
                                </span>
                            </span>
                            <ThemeToggle />
                            <LanguageSelector />
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                aria-label={t('nav.profile')}
                            >
                                <Link href={route('profile.edit')}>
                                    <UserRound className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <LanguageSelector />
                            <ThemeToggle />

                            {canLogin && (
                                <Button asChild variant="ghost">
                                    <Link href={route('login')}>
                                        {t('nav.login')}
                                    </Link>
                                </Button>
                            )}

                            {canRegister && (
                                <Button asChild variant="default">
                                    <Link href={route('register')}>
                                        {t('nav.register')}
                                    </Link>
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
