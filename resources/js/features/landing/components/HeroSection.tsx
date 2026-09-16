import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import ProjectionPreview from '@/features/landing/components/ProjectionPreview';
import type { LandingPageProps } from '@/features/landing/types';

const TRUST_KEYS = ['noCard', 'encrypted', 'quickStart'] as const;

export default function HeroSection({ canRegister }: Pick<LandingPageProps, 'canRegister'>) {
    const { t } = useTranslation();

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
            <div className="flex flex-col gap-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/25 bg-brand/8 px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] text-brand uppercase">
                    <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                    {t('landing.hero.badge')}
                </span>

                <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    {t('landing.hero.title')}
                </h1>

                <p className="max-w-lg text-base text-pretty text-muted-foreground lg:text-lg">
                    {t('landing.hero.description')}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                    {canRegister && (
                        <Button asChild variant="brand" size="lg">
                            <Link href={route('register')}>{t('landing.hero.ctaPrimary')}</Link>
                        </Button>
                    )}

                    {/* The freemium calculator is the demo: it is the one page a
                        visitor can use without an account (route moved to
                        /calculator when this landing page took over "/"). */}
                    <Button asChild variant="outline" size="lg">
                        <Link href={route('calculator.freemium')}>
                            {t('landing.hero.ctaSecondary')}
                        </Link>
                    </Button>
                </div>

                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {TRUST_KEYS.map((key) => (
                        <li
                            key={key}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                            <Check aria-hidden className="size-4 text-brand" />
                            {t(`landing.hero.trust.${key}`)}
                        </li>
                    ))}
                </ul>
            </div>

            <ProjectionPreview />
        </section>
    );
}
