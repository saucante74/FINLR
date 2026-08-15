<?php

namespace App\Modules\User\Actions;

use App\Modules\User\DTOs\ProfileUpdateData;
use App\Modules\User\Models\User;

class UpdateProfileAction
{
    public function handle(User $user, ProfileUpdateData $data): void
    {
        $user->fill([
            'name' => $data->name,
            'email' => $data->email,
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }
}
