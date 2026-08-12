import { Link } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useDarkMode from '@/hooks/useDarkMode';

const LOCALES = ['fr', 'en', 'it'];

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

export default function Navbar({ canLogin, canRegister }) {
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold tracking-tight text-foreground"
                >
                    <ApplicationLogo className="size-6 fill-current text-primary" />
                    <span>{t('nav.brand')}</span>
                </Link>

                <div className="flex items-center gap-2">
                    <LanguageSelector />
                    <ThemeToggle />

                    {canLogin && (
                        <Button asChild variant="ghost">
                            <Link href={route('login')}>{t('nav.login')}</Link>
                        </Button>
                    )}

                    {canRegister && (
                        <Button asChild variant="default">
                            <Link href={route('register')}>
                                {t('nav.register')}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
