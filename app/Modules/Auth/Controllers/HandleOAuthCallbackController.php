<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\AuthenticateViaOAuthAction;
use App\Modules\Auth\DTOs\OAuthUserData;
use App\Modules\Auth\Enums\OAuthProvider;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class HandleOAuthCallbackController extends Controller
{
    public function __invoke(OAuthProvider $provider, AuthenticateViaOAuthAction $action): RedirectResponse
    {
        try {
            $socialiteUser = Socialite::driver($provider->value)->user();

            $action->handle($provider, OAuthUserData::fromSocialiteUser($socialiteUser));
        } catch (Throwable $exception) {
            report($exception);

            return Redirect::route('login')->withErrors([
                'email' => trans('auth.oauth_failed'),
            ]);
        }

        return Redirect::intended(route('dashboard', absolute: false));
    }
}
