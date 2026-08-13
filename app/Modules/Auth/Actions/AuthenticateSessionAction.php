<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Requests\LoginRequest;

class AuthenticateSessionAction
{
    public function handle(LoginRequest $request): void
    {
        $request->authenticate();

        $request->session()->regenerate();
    }
}
