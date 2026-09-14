import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { BILLING_PERIODS, DEFAULT_BILLING_PERIOD } from '@/features/subscriptions/constants';
import type { BillingPeriod } from '@/features/subscriptions/types';
import { cn } from '@/lib/utils';

interface CheckoutFormValues {
    period: BillingPeriod;
}

// No amount is displayed on purpose: prices live only in Stripe (one Price
// per period) and are shown on the hosted Checkout page.
export default function PremiumCheckoutForm() {
    const { t } = useTranslation();
    const { data, setData, post, processing } = useForm<CheckoutFormValues>({
        period: DEFAULT_BILLING_PERIOD,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(route('billing.checkout'));
    };

    return (
        <form onSubmit={submit} className="flex flex-wrap items-center gap-3">
            <div
                role="group"
                aria-label={t('dashboard.promo.periodLabel')}
                className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5"
            >
                {BILLING_PERIODS.map((period) => {
                    const active = data.period === period;

                    return (
                        <button
                            key={period}
                            type="button"
                            onClick={() => setData('period', period)}
                            aria-pressed={active}
                            className={cn(
                                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                                active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                        >
                            {t(`dashboard.promo.periods.${period}`)}
                        </button>
                    );
                })}
            </div>
            <Button type="submit" variant="brand" size="lg" className="w-fit shrink-0" disabled={processing}>
                {t('dashboard.promo.cta')}
            </Button>
        </form>
    );
}
