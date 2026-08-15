<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\DTOs\PasswordResetLinkData;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class SendPasswordResetLinkAction
{
    /**
     * @throws ValidationException
     */
    public function handle(PasswordResetLinkData $data): string
    {
        $status = Password::sendResetLink($data->toArray());

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [trans($status)],
            ]);
        }

        return $status;
    }
}
