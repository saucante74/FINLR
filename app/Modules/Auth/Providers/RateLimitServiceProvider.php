<?php

namespace App\Modules\Auth\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the named rate limiters guarding the public authentication
 * endpoints. Credential stuffing on the login route is already handled by
 * LoginRequest's own limiter, which is left untouched.
 */
class RateLimitServiceProvider extends ServiceProvider
{
    private const REGISTER_ATTEMPTS_PER_MINUTE = 5;

    private const PASSWORD_RESET_ATTEMPTS_PER_MINUTE = 5;

    private const FORGOT_PASSWORD_ATTEMPTS_PER_MINUTE = 3;

    private const FORGOT_PASSWORD_ATTEMPTS_PER_HOUR_PER_EMAIL = 3;

    private const OAUTH_ATTEMPTS_PER_MINUTE = 10;

    public function boot(): void
    {
        RateLimiter::for('register', fn (Request $request): Limit => Limit::perMinute(self::REGISTER_ATTEMPTS_PER_MINUTE)
            ->by($this->ipKey($request)));

        RateLimiter::for('oauth', fn (Request $request): Limit => Limit::perMinute(self::OAUTH_ATTEMPTS_PER_MINUTE)
            ->by($this->ipKey($request)));

        RateLimiter::for('reset-password', fn (Request $request): Limit => Limit::perMinute(self::PASSWORD_RESET_ATTEMPTS_PER_MINUTE)
            ->by($this->ipKey($request)));

        // Two independent budgets: one protects the server from a single host,
        // the other protects a given mailbox from being flooded from many hosts.
        RateLimiter::for('forgot-password', fn (Request $request): array => [
            Limit::perMinute(self::FORGOT_PASSWORD_ATTEMPTS_PER_MINUTE)
                ->by($this->ipKey($request)),
            Limit::perHour(self::FORGOT_PASSWORD_ATTEMPTS_PER_HOUR_PER_EMAIL)
                ->by($this->emailKey($request)),
        ]);
    }

    private function ipKey(Request $request): string
    {
        return 'ip:'.$request->ip();
    }

    private function emailKey(Request $request): string
    {
        return 'email:'.$request->string('email')->lower()->trim()->toString();
    }
}
