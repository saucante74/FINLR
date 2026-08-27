<?php

namespace Tests\Feature;

use Tests\TestCase;

class InertiaAuthRedirectTest extends TestCase
{
    public function test_a_guest_inertia_put_request_gets_an_inertia_location_redirect_to_login(): void
    {
        $response = $this->put('/password', [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ], [
            'X-Inertia' => 'true',
        ]);

        $response->assertStatus(409);
        $response->assertHeader('X-Inertia-Location', route('login'));
    }

    public function test_a_guest_inertia_delete_request_gets_an_inertia_location_redirect_to_login(): void
    {
        $response = $this->delete('/settings', [
            'password' => 'password',
        ], [
            'X-Inertia' => 'true',
        ]);

        $response->assertStatus(409);
        $response->assertHeader('X-Inertia-Location', route('login'));
    }

    public function test_a_guest_non_inertia_request_still_gets_a_plain_redirect_to_login(): void
    {
        $response = $this->put('/password', [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertRedirect(route('login'));
    }
}
