import { useTranslation } from 'react-i18next';

import ApplicationLogo from '@/components/ApplicationLogo';

const LEGAL_KEYS = ['notice', 'terms', 'privacy'] as const;
const SOCIAL_KEYS = ['linkedin', 'twitter'] as const;

/**
 * The landing footer, richer than the application-wide Footer (brand blurb,
 * legal column, social column). The legal and social entries are rendered as
 * plain text, not links: neither the legal pages nor the social accounts
 * exist yet in this project, and the same convention already applies to the
 * Navbar's "Ressources" entry. They become links the day the routes exist.
 */
export default function LandingFooter() {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-border">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <span className="flex items-center gap-2 font-semibold tracking-tight">
                        <ApplicationLogo className="size-10" />
                        <span className="text-xl">{t('nav.brand')}</span>
                    </span>
                    <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                        {t('landing.footer.tagline')}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                        {t('landing.footer.legal.title')}
                    </span>
                    <ul className="flex flex-col gap-2">
                        {LEGAL_KEYS.map((key) => (
                            <li key={key} className="text-sm text-muted-foreground">
                                {t(`landing.footer.legal.${key}`)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                        {t('landing.footer.social.title')}
                    </span>
                    <ul className="flex flex-col gap-2">
                        {SOCIAL_KEYS.map((key) => (
                            <li key={key} className="text-sm text-muted-foreground">
                                {t(`landing.footer.social.${key}`)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="border-t border-border">
                <div className="mx-auto max-w-7xl px-4 py-6 font-mono text-xs text-muted-foreground lg:px-8">
                    {t('footer.copyright', { year: new Date().getFullYear() })}
                </div>
            </div>
        </footer>
    );
}
