<?php

namespace App\Modules\Auth\Actions;

use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdatePasswordAction
{
    public function handle(User $user, string $password): void
    {
        $user->update([
            'password' => Hash::make($password),
        ]);
    }
}
