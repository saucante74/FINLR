import { useTranslation } from 'react-i18next';

import PricingCard from '@/features/landing/components/PricingCard';
import SectionHeading from '@/features/landing/components/SectionHeading';
import {
    FREE_PLAN_FEATURE_KEYS,
    PREMIUM_PLAN_FEATURE_KEYS,
} from '@/features/landing/constants';
import type { LandingPageProps } from '@/features/landing/types';

/**
 * The premium card deliberately shows no amount and no monthly/yearly price
 * switch, unlike the mockup: subscription amounts live only in Stripe (one
 * Price per BillingPeriod, IDs in config/services.php) and are shown on the
 * hosted Checkout page — see CLAUDE.md, "Journal de Décisions Produit".
 * Displaying "9 € / mois" here would be the exact duplication that decision
 * rules out. The free plan's "0 €" is the plan itself, not a Stripe amount,
 * so it can never drift.
 *
 * Both calls to action point at registration: /billing/checkout requires an
 * authenticated and verified user, so signing up is the real first step.
 */
export default function PricingSection({ canRegister }: Pick<LandingPageProps, 'canRegister'>) {
    const { t } = useTranslation();

    const registerHref = canRegister ? route('register') : undefined;

    return (
        <section
            id="pricing"
            className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-12 px-4 py-16 lg:px-8 lg:py-24"
        >
            <SectionHeading
                eyebrow={t('landing.pricing.eyebrow')}
                title={t('landing.pricing.title')}
                centered
            />

            <div className="grid gap-6 md:grid-cols-2">
                <PricingCard
                    name={t('landing.pricing.plans.free.name')}
                    tagline={t('landing.pricing.plans.free.tagline')}
                    price={
                        <p className="text-4xl font-semibold tracking-tight">
                            {t('landing.pricing.plans.free.price')}
                        </p>
                    }
                    features={FREE_PLAN_FEATURE_KEYS.map((key) =>
                        t(`landing.pricing.plans.free.features.${key}`),
                    )}
                    ctaLabel={t('landing.pricing.plans.free.cta')}
                    ctaHref={registerHref}
                />

                <PricingCard
                    name={t('landing.pricing.plans.premium.name')}
                    tagline={t('landing.pricing.plans.premium.tagline')}
                    price={
                        <p className="text-sm text-muted-foreground">
                            {t('landing.pricing.plans.premium.priceNote')}
                        </p>
                    }
                    badge={t('landing.pricing.plans.premium.badge')}
                    features={PREMIUM_PLAN_FEATURE_KEYS.map((key) =>
                        t(`landing.pricing.plans.premium.features.${key}`),
                    )}
                    ctaLabel={t('landing.pricing.plans.premium.cta')}
                    ctaHref={registerHref}
                    highlighted
                />
            </div>
        </section>
    );
}
