<?php

namespace App\Modules\Subscriptions\Actions;

use App\Modules\Subscriptions\Enums\BillingPeriod;
use App\Modules\User\Models\User;

class StartCheckoutAction
{
    /**
     * Returns where to send the user: the Stripe Checkout page, or the
     * billing portal when they're already subscribed — a second checkout
     * would create a second, parallel subscription billed on top.
     */
    public function handle(User $user, BillingPeriod $period): string
    {
        if ($user->subscribed(User::SUBSCRIPTION_TYPE)) {
            return route('billing.portal');
        }

        return $user
            ->newSubscription(User::SUBSCRIPTION_TYPE, $period->priceId())
            ->checkout([
                'success_url' => route('billing.checkout.success'),
                'cancel_url' => route('dashboard'),
            ])
            ->redirect()
            ->getTargetUrl();
    }
}
