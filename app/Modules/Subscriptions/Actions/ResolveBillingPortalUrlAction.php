<?php

namespace App\Modules\Subscriptions\Actions;

use App\Modules\User\Models\User;

class ResolveBillingPortalUrlAction
{
    /**
     * A user who never went through checkout has no Stripe customer, and
     * Cashier refuses to open a portal session without one: send them back
     * to the dashboard (where the upgrade offer lives) instead.
     */
    public function handle(User $user): string
    {
        if (! $user->hasStripeId()) {
            return route('dashboard');
        }

        return $user->billingPortalUrl(route('settings.edit'));
    }
}
