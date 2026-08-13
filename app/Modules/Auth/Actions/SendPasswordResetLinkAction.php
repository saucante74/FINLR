<?php

namespace App\Modules\Auth\Actions;

use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class SendPasswordResetLinkAction
{
    /**
     * @param  array{email: string}  $data
     *
     * @throws ValidationException
     */
    public function handle(array $data): string
    {
        $status = Password::sendResetLink($data);

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [trans($status)],
            ]);
        }

        return $status;
    }
}
