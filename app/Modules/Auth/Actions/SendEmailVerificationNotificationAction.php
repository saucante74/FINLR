<?php

namespace App\Modules\Auth\Actions;

use App\Modules\User\Models\User;

class SendEmailVerificationNotificationAction
{
    public function handle(User $user): bool
    {
        if ($user->hasVerifiedEmail()) {
            return false;
        }

        $user->sendEmailVerificationNotification();

        return true;
    }
}
