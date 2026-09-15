<?php

namespace App\Modules\Subscriptions\Enums;

enum BillingPeriod: string
{
    case MONTHLY = 'monthly';
    case YEARLY = 'yearly';

    /**
     * The Stripe Price backing this period. Amounts live only in Stripe:
     * changing a price means pointing this config at another Price ID,
     * never touching code.
     */
    public function priceId(): string
    {
        return (string) config("services.stripe.premium_prices.{$this->value}");
    }
}
