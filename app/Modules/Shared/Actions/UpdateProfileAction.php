<?php

namespace App\Modules\Shared\Actions;

use App\Modules\Shared\Models\User;

class UpdateProfileAction
{
    /**
     * Update the user's profile information.
     *
     * @param  array{name: string, email: string}  $data
     */
    public function handle(User $user, array $data): void
    {
        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }
}
