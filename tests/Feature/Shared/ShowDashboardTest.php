<?php

namespace Tests\Feature\Shared;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShowDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_dashboard_receives_the_scenarios_prop_with_the_right_total_for_the_current_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Scenario::factory()->count(3)->create(['user_id' => $user->id]);
        Scenario::factory()->count(5)->create(['user_id' => $other->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('scenarios.data', 3)
            ->where('scenarios.total', 3)
            ->where('scenarios.currentPage', 1)
            ->where('scenarios.lastPage', 1)
            ->where('scenarios.perPage', 10)
        );
    }

    public function test_a_page_is_capped_at_ten_scenarios(): void
    {
        $user = User::factory()->create();
        Scenario::factory()->count(11)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('scenarios.data', 10)
            ->where('scenarios.total', 11)
            ->where('scenarios.lastPage', 2)
        );
    }

    public function test_the_second_page_is_reached_via_the_page_query_parameter(): void
    {
        $user = User::factory()->create();
        Scenario::factory()->count(11)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('dashboard', ['page' => 2]));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('scenarios.data', 1)
            ->where('scenarios.currentPage', 2)
        );
    }

    public function test_the_scenario_list_is_filtered_by_the_type_query_parameter(): void
    {
        $user = User::factory()->create();
        Scenario::factory()->count(2)->create([
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::Fire,
            'result_payload' => ['requiredCapital' => 500_000.0, 'yearsToRetirement' => 25.0],
        ]);
        Scenario::factory()->count(3)->create(['user_id' => $user->id, 'calculator_type' => CalculatorType::SingleEnvelope]);

        $response = $this->actingAs($user)->get(route('dashboard', ['type' => 'fire']));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('scenarios.data', 2)
            ->where('scenarios.total', 2)
            ->where('scenarioTypeFilter', 'fire')
        );
    }

    public function test_an_invalid_type_query_parameter_is_ignored(): void
    {
        $user = User::factory()->create();
        Scenario::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('dashboard', ['type' => 'not-a-real-type']));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->where('scenarios.total', 3)
            ->where('scenarioTypeFilter', null)
        );
    }
}
