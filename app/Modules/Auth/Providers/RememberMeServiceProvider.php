<?php

namespace App\Modules\Auth\Providers;

use Illuminate\Auth\SessionGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

/**
 * `Illuminate\Auth\SessionGuard::$rememberDuration` defaults to 576000
 * minutes (400 days — the maximum lifetime modern browsers allow for a
 * cookie), not 30. /login's "remember me" checkbox explicitly promises
 * "Rester connecté 30 jours" (lang/{fr,en,it}.json: auth.login.rememberMe),
 * so the actual cookie lifetime is set here to match that promise instead
 * of silently keeping users signed in more than 13x longer than told.
 */
class RememberMeServiceProvider extends ServiceProvider
{
    private const REMEMBER_DAYS = 30;

    public function boot(): void
    {
        $guard = Auth::guard('web');

        if ($guard instanceof SessionGuard) {
            $guard->setRememberDuration(self::REMEMBER_DAYS * 24 * 60);
        }
    }
}
