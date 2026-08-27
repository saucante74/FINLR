<?php

namespace Tests\Feature\Auth;

use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_login_screen_renders_the_expected_inertia_component(): void
    {
        $response = $this->get('/login');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Login')
            ->has('canResetPassword')
        );
    }

    public function test_login_fails_validation_with_missing_credentials(): void
    {
        $response = $this->from('/login')->post('/login', []);

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors(['email']);
        $this->assertGuest();
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_remember_me_cookie_is_set_for_thirty_days_when_checked(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'remember' => 'on',
        ]);

        $this->assertAuthenticated();

        $cookie = collect($response->headers->getCookies())
            ->first(fn ($cookie) => str_starts_with($cookie->getName(), 'remember_web_'));

        $this->assertNotNull($cookie, 'Expected a remember_web_* cookie to be set.');
        $this->assertTrue($cookie->isHttpOnly());

        $expiresInDays = ($cookie->getExpiresTime() - time()) / 86400;
        $this->assertEqualsWithDelta(30, $expiresInDays, 0.01);
    }

    public function test_no_remember_me_cookie_is_set_when_not_checked(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();

        $cookie = collect($response->headers->getCookies())
            ->first(fn ($cookie) => str_starts_with($cookie->getName(), 'remember_web_'));

        $this->assertNull($cookie);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
