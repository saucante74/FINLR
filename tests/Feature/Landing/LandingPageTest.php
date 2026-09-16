<?php

namespace Tests\Feature\Landing;

use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_is_accessible_and_renders_the_landing_component(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('Landing'));
    }

    public function test_home_page_exposes_authentication_route_availability(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('canLogin', true)
            ->where('canRegister', true)
        );
    }

    public function test_home_page_stays_public_for_an_authenticated_user(): void
    {
        $response = $this->actingAs(User::factory()->create())->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('Landing'));
    }
}
