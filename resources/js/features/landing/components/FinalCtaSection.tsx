import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import type { LandingPageProps } from '@/features/landing/types';

export default function FinalCtaSection({
    canRegister,
}: Pick<LandingPageProps, 'canRegister'>) {
    const { t } = useTranslation();

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-brand/25 bg-brand/8 px-6 py-14 text-center lg:py-20">
                <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
                    {t('landing.finalCta.title')}
                </h2>

                <p className="max-w-xl text-base text-pretty text-muted-foreground">
                    {t('landing.finalCta.description')}
                </p>

                {canRegister && (
                    <Button asChild variant="brand" size="lg">
                        <Link href={route('register')}>{t('landing.finalCta.cta')}</Link>
                    </Button>
                )}
            </div>
        </section>
    );
}
