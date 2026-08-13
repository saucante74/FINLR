<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Shared\Models\User;
use Illuminate\Auth\Events\Verified;

class VerifyEmailAction
{
    public function handle(User $user): void
    {
        if ($user->hasVerifiedEmail()) {
            return;
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }
    }
}
