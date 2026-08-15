<?php

namespace App\Modules\User\Actions;

use App\Modules\User\Models\User;

class UpdateProfileAction
{
    /**
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
