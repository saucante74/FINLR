<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Shared\Models\User;

class SendEmailVerificationNotificationAction
{
    /**
     * Send the email verification notification, unless already verified.
     *
     * @return bool Whether a notification was sent.
     */
    public function handle(User $user): bool
    {
        if ($user->hasVerifiedEmail()) {
            return false;
        }

        $user->sendEmailVerificationNotification();

        return true;
    }
}
