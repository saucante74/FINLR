import { useTranslation } from 'react-i18next';

/**
 * Placeholder section, exactly as drawn in the mockup: no testimonial is
 * invented here, the copy says out loud that real user feedback is still to
 * come.
 */
export default function SocialProofSection() {
    const { t } = useTranslation();

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-12 text-center text-card-foreground lg:py-16">
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    {t('landing.socialProof.eyebrow')}
                </span>
                <p className="max-w-xl text-base text-pretty text-muted-foreground">
                    {t('landing.socialProof.text')}
                </p>
            </div>
        </section>
    );
}
