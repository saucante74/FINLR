<?php

namespace App\Modules\Auth\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

/**
 * A single source of truth for the app's password strength policy.
 * `Password::defaults()` is already used by every request that sets or
 * changes a password (registration, reset, settings update), so this is
 * the only place the rule set needs to be defined.
 */
class PasswordPolicyServiceProvider extends ServiceProvider
{
    private const MIN_LENGTH = 8;

    public function boot(): void
    {
        Password::defaults(fn (): Password => Password::min(self::MIN_LENGTH)
            ->mixedCase()
            ->numbers()
            ->symbols());
    }
}
