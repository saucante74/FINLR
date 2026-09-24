import { useTranslation } from 'react-i18next';

import {
    HERO_CHART_BARS,
    HERO_PROJECTION_TICKS,
    HERO_PROJECTION_YEARS,
} from '@/features/landing/constants';

/**
 * The hero's illustrative projection card. Every figure it shows is marketing
 * copy held in the translation files, not a computed result: the page never
 * runs a projection (the real ones live in the simulators, backed by
 * saucante74/finlr-engine). The chart itself is drawn from the decorative
 * HERO_CHART_BARS shape, and a screen-reader-only sentence says out loud that
 * the example is illustrative.
 */
export default function ProjectionPreview() {
    const { t } = useTranslation();

    const startYear = new Date().getFullYear();
    const endYear = startYear + HERO_PROJECTION_YEARS;
    const tickStep = HERO_PROJECTION_YEARS / (HERO_PROJECTION_TICKS - 1);
    const ticks = Array.from(
        { length: HERO_PROJECTION_TICKS },
        (_, index) => startYear + index * tickStep,
    );

    return (
        <div className="relative pb-12 sm:pb-16">
            <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm lg:p-8">
                <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                        {t('landing.hero.preview.label', { years: HERO_PROJECTION_YEARS })}
                    </span>
                    <span className="shrink-0 rounded-full border border-brand/25 bg-brand/8 px-2.5 py-1 font-mono text-xs text-brand">
                        {t('landing.hero.preview.rate')}
                    </span>
                </div>

                <p className="text-4xl font-semibold tracking-tight text-brand lg:text-5xl">
                    {t('landing.hero.preview.amount')}
                </p>

                <div className="flex flex-col gap-3">
                    <p className="sr-only">
                        {t('landing.hero.preview.srDescription', {
                            years: HERO_PROJECTION_YEARS,
                            startYear,
                            endYear,
                        })}
                    </p>

                    <div
                        aria-hidden
                        className="flex h-32 items-end gap-1 sm:h-40 lg:h-48"
                    >
                        {HERO_CHART_BARS.map((height, index) => (
                            <span
                                key={index}
                                style={{ height: `${height}%` }}
                                className="flex-1 rounded-sm bg-brand/70"
                            />
                        ))}
                    </div>

                    <div
                        aria-hidden
                        className="flex justify-between font-mono text-xs text-muted-foreground"
                    >
                        {ticks.map((year) => (
                            <span key={year}>{year}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-4 flex flex-col gap-1 rounded-xl border border-border bg-card px-5 py-4 text-card-foreground shadow-sm sm:left-8">
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    {t('landing.hero.preview.comparisonLabel')}
                </span>
                <span className="text-xl font-semibold tracking-tight text-brand">
                    {t('landing.hero.preview.comparisonAmount')}
                </span>
            </div>
        </div>
    );
}
