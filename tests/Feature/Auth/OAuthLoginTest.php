<?php

namespace Tests\Feature\Auth;

use App\Modules\Auth\Enums\OAuthProvider;
use App\Modules\Auth\Models\OAuthAccount;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use RuntimeException;
use Tests\TestCase;

class OAuthLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_redirect_route_exists_for_google_and_microsoft(): void
    {
        foreach (OAuthProvider::cases() as $provider) {
            $response = $this->get(route('oauth.redirect', ['provider' => $provider->value]));

            $response->assertRedirect();
        }
    }

    public function test_an_unsupported_provider_is_not_found(): void
    {
        $response = $this->get('/auth/facebook/redirect');

        $response->assertNotFound();
    }

    public function test_a_new_user_is_created_and_signed_in_on_first_oauth_login(): void
    {
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-1',
            'email' => 'new-oauth-user@example.com',
            'name' => 'New OAuth User',
        ]));

        $response = $this->get(route('oauth.callback', ['provider' => 'google']));

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::query()->where('email', 'new-oauth-user@example.com')->first();

        $this->assertNotNull($user);
        $this->assertNull($user->password);
        $this->assertNotNull($user->email_verified_at);

        $this->assertDatabaseHas('oauth_accounts', [
            'user_id' => $user->id,
            'provider' => OAuthProvider::GOOGLE->value,
            'provider_id' => 'google-1',
        ]);
    }

    public function test_a_returning_oauth_user_is_signed_in_without_creating_a_duplicate(): void
    {
        $user = User::factory()->create(['email' => 'returning@example.com']);

        OAuthAccount::factory()->for($user)->create([
            'provider' => OAuthProvider::GOOGLE,
            'provider_id' => 'google-42',
        ]);

        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-42',
            'email' => 'returning@example.com',
            'name' => 'Returning User',
        ]));

        $this->get(route('oauth.callback', ['provider' => 'google']));

        $this->assertAuthenticatedAs($user);
        $this->assertSame(1, User::query()->where('email', 'returning@example.com')->count());
        $this->assertSame(1, OAuthAccount::query()->where('user_id', $user->id)->count());
    }

    public function test_an_oauth_login_links_to_an_existing_email_password_account_instead_of_duplicating_it(): void
    {
        $existingUser = User::factory()->create(['email' => 'shared@example.com']);

        Socialite::fake('microsoft', SocialiteUser::fake([
            'id' => 'microsoft-7',
            'email' => 'shared@example.com',
            'name' => 'Shared Account',
        ]));

        $this->get(route('oauth.callback', ['provider' => 'microsoft']));

        $this->assertAuthenticatedAs($existingUser);
        $this->assertSame(1, User::query()->where('email', 'shared@example.com')->count());

        $this->assertDatabaseHas('oauth_accounts', [
            'user_id' => $existingUser->id,
            'provider' => OAuthProvider::MICROSOFT->value,
            'provider_id' => 'microsoft-7',
        ]);
    }

    public function test_a_second_provider_links_to_the_same_user_as_the_first(): void
    {
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-99',
            'email' => 'multi-provider@example.com',
            'name' => 'Multi Provider',
        ]));

        $this->get(route('oauth.callback', ['provider' => 'google']));
        $user = User::query()->where('email', 'multi-provider@example.com')->firstOrFail();

        Socialite::fake('microsoft', SocialiteUser::fake([
            'id' => 'microsoft-99',
            'email' => 'multi-provider@example.com',
            'name' => 'Multi Provider',
        ]));

        $this->get(route('oauth.callback', ['provider' => 'microsoft']));

        $this->assertAuthenticatedAs($user);
        $this->assertSame(1, User::query()->where('email', 'multi-provider@example.com')->count());
        $this->assertSame(2, OAuthAccount::query()->where('user_id', $user->id)->count());
    }

    public function test_an_oauth_provider_failure_redirects_to_login_with_an_error_and_does_not_authenticate(): void
    {
        Socialite::fake('google', function (): never {
            throw new RuntimeException('The provider is unreachable.');
        });

        $response = $this->get(route('oauth.callback', ['provider' => 'google']));

        $this->assertGuest();
        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('email');
    }

    public function test_a_new_oauth_user_gets_a_remember_me_cookie(): void
    {
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-remember',
            'email' => 'remember-oauth@example.com',
            'name' => 'Remember OAuth',
        ]));

        $response = $this->get(route('oauth.callback', ['provider' => 'google']));

        $cookie = collect($response->headers->getCookies())
            ->first(fn ($cookie) => str_starts_with($cookie->getName(), 'remember_web_'));

        $this->assertNotNull($cookie, 'Expected a remember_web_* cookie to be set after OAuth login.');
    }
}
