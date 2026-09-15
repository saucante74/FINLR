<?php

namespace App\Modules\Subscriptions\Enums;

/**
 * Subscription statuses as reported by the Stripe API itself — which can be
 * ahead of the local `subscriptions` table while a webhook is still in flight.
 */
enum StripeSubscriptionStatus: string
{
    case INCOMPLETE = 'incomplete';
    case INCOMPLETE_EXPIRED = 'incomplete_expired';
    case TRIALING = 'trialing';
    case ACTIVE = 'active';
    case PAST_DUE = 'past_due';
    case CANCELED = 'canceled';
    case UNPAID = 'unpaid';
    case PAUSED = 'paused';

    /**
     * Only a subscription that can never bill again leaves room for a new
     * checkout. "incomplete" is a payment still being processed: starting a
     * second checkout on top of it is exactly how duplicates get created.
     */
    public function blocksNewCheckout(): bool
    {
        return match ($this) {
            self::CANCELED, self::INCOMPLETE_EXPIRED => false,
            default => true,
        };
    }

    /**
     * A status this enum doesn't know yet (added by Stripe later) blocks by
     * default: refusing a checkout is recoverable, a duplicate charge isn't.
     */
    public static function blocksNewCheckoutFor(string $status): bool
    {
        return self::tryFrom($status)?->blocksNewCheckout() ?? true;
    }
}
