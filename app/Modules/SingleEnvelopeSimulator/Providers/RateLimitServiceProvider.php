<?php

namespace App\Modules\SingleEnvelopeSimulator\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the named rate limiter guarding the single-envelope simulation
 * endpoint, which triggers a call to the external calculation engine. The
 * route is already authenticated and gated behind advanced_calculator, so
 * the budget is per user rather than per IP.
 */
class RateLimitServiceProvider extends ServiceProvider
{
    private const RUN_SIMULATION_ATTEMPTS_PER_MINUTE = 10;

    public function boot(): void
    {
        RateLimiter::for('run-simulation', fn (Request $request): Limit => Limit::perMinute(self::RUN_SIMULATION_ATTEMPTS_PER_MINUTE)
            ->by($this->userKey($request)));
    }

    private function userKey(Request $request): string
    {
        return 'user:'.$request->user()->id;
    }
}
