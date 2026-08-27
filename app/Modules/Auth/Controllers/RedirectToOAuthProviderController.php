<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Enums\OAuthProvider;
use App\Modules\Shared\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;

class RedirectToOAuthProviderController extends Controller
{
    public function __invoke(OAuthProvider $provider): RedirectResponse
    {
        return Socialite::driver($provider->value)->redirect();
    }
}
