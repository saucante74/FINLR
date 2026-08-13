<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Requests\LoginRequest;

class AuthenticateSessionAction
{
    /**
     * Authenticate the request's credentials and start a fresh session.
     */
    public function handle(LoginRequest $request): void
    {
        $request->authenticate();

        $request->session()->regenerate();
    }
}
