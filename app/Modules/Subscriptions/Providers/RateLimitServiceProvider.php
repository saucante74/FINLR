<?php

namespace App\Modules\Subscriptions\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

/**
 * Each checkout attempt creates a Stripe customer/session through the
 * Stripe API, so the route is budgeted per authenticated user.
 */
class RateLimitServiceProvider extends ServiceProvider
{
    private const CHECKOUT_ATTEMPTS_PER_MINUTE = 5;

    public function boot(): void
    {
        RateLimiter::for('billing-checkout', fn (Request $request): Limit => Limit::perMinute(self::CHECKOUT_ATTEMPTS_PER_MINUTE)
            ->by('user:'.$request->user()?->id));
    }
}
