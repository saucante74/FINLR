<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Shared\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdatePasswordAction
{
    /**
     * Update the user's password.
     */
    public function handle(User $user, string $password): void
    {
        $user->update([
            'password' => Hash::make($password),
        ]);
    }
}
