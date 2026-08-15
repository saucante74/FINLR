<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\DTOs\RegisterUserData;
use App\Modules\User\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function handle(RegisterUserData $data): User
    {
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return $user;
    }
}
