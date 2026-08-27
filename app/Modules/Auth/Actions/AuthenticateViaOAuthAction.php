<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\DTOs\OAuthUserData;
use App\Modules\Auth\Enums\OAuthProvider;
use App\Modules\Auth\Models\OAuthAccount;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthenticateViaOAuthAction
{
    public function handle(OAuthProvider $provider, OAuthUserData $data): User
    {
        $account = OAuthAccount::query()
            ->where('provider', $provider)
            ->where('provider_id', $data->providerId)
            ->first();

        $user = $account !== null ? $account->user : $this->findOrCreateUser($provider, $data);

        if ($user->email_verified_at === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        Auth::login($user, remember: true);

        return $user;
    }

    private function findOrCreateUser(OAuthProvider $provider, OAuthUserData $data): User
    {
        $user = User::query()->where('email', $data->email)->first();

        // No password: this account can only ever be reached through an
        // OAuth provider, never through the email/password form.
        $user ??= User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => null,
        ]);

        $user->oauthAccounts()->create([
            'provider' => $provider,
            'provider_id' => $data->providerId,
        ]);

        return $user;
    }
}
