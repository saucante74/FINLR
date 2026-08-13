<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Shared\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ConfirmPasswordAction
{
    /**
     * @throws ValidationException
     */
    public function handle(User $user, string $password): void
    {
        if (! Auth::guard('web')->validate([
            'email' => $user->email,
            'password' => $password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }
    }
}
