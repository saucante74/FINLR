<?php

namespace Tests\Feature\Scenarios;

use App\Modules\Scenarios\Models\Scenario;
use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RenameScenarioTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_scenario_owner_can_rename_it(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);
        $scenario = Scenario::factory()->create(['user_id' => $user->id, 'name' => null]);

        $response = $this->actingAs($user)->patch(
            route('scenarios.rename', $scenario),
            ['name' => 'Retraite à 62 ans'],
        );

        $response->assertRedirect(route('scenarios.show', $scenario, absolute: false));
        $this->assertSame('Retraite à 62 ans', $scenario->fresh()->name);
    }

    public function test_the_owner_can_clear_the_name_back_to_the_generic_label(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);
        $scenario = Scenario::factory()->create(['user_id' => $user->id, 'name' => 'Ancien nom']);

        $this->actingAs($user)->patch(route('scenarios.rename', $scenario), ['name' => '']);

        $this->assertNull($scenario->fresh()->name);
    }

    public function test_another_authenticated_user_receives_404_and_the_name_is_unchanged(): void
    {
        $owner = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);
        $scenario = Scenario::factory()->create(['user_id' => $owner->id, 'name' => 'Nom original']);

        $intruder = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($intruder)->patch(
            route('scenarios.rename', $scenario),
            ['name' => 'Nom usurpé'],
        );

        $response->assertNotFound();
        $this->assertSame('Nom original', $scenario->fresh()->name);
    }

    public function test_a_name_longer_than_255_characters_is_rejected(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);
        $scenario = Scenario::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->patch(
            route('scenarios.rename', $scenario),
            ['name' => str_repeat('a', 256)],
        );

        $response->assertSessionHasErrors('name');
    }
}
