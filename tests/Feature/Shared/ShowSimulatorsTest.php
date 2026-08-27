<?php

namespace Tests\Feature\Shared;

use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShowSimulatorsTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('simulators.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_an_authenticated_verified_user_receives_the_expected_inertia_component(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('simulators.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('simulator/Simulators'));
    }
}
