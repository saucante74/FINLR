<?php

namespace Tests\Feature\Shared;

use App\Modules\Scenarios\Models\Scenario;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShowDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_dashboard_receives_the_scenarios_prop_with_the_right_count_for_the_current_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Scenario::factory()->count(3)->create(['user_id' => $user->id]);
        Scenario::factory()->count(5)->create(['user_id' => $other->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('scenarios', 3)
        );
    }
}
