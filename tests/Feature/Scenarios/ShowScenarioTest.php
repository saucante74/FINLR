<?php

namespace Tests\Feature\Scenarios;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShowScenarioTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_scenario_owner_receives_200_with_the_expected_inertia_component(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);
        $input = $this->scenarioInputPayload();
        $result = $this->scenarioResultPayload();
        $scenario = Scenario::factory()->create([
            'user_id' => $user->id,
            'name' => 'Retraite à 62 ans',
            'input_payload' => $input,
            'result_payload' => $result,
        ]);

        $response = $this->actingAs($user)->get(route('scenarios.show', $scenario));

        $response->assertOk();
        // Inertia props travel to the browser as JSON: whole-number floats
        // lose their float type on the wire, same as any PHP value
        // round-tripped through json_encode/json_decode. The expected side
        // is normalized through the same round-trip for an accurate comparison.
        $response->assertInertia(fn (Assert $page) => $page
            ->component('scenario/ScenarioShow')
            ->where('input', $this->normalizeForJsonComparison($input))
            ->where('result', $this->normalizeForJsonComparison($result))
            ->where('calculatorType', CalculatorType::SingleEnvelope->value)
            ->where('createdAt', $scenario->created_at->toISOString())
            ->where('name', 'Retraite à 62 ans')
        );
    }

    public function test_a_scenario_without_a_name_exposes_name_null(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);
        $scenario = Scenario::factory()->create([
            'user_id' => $user->id,
            'input_payload' => $this->scenarioInputPayload(),
            'result_payload' => $this->scenarioResultPayload(),
        ]);

        $response = $this->actingAs($user)->get(route('scenarios.show', $scenario));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('scenario/ScenarioShow')
            ->where('name', null)
        );
    }

    public function test_another_authenticated_user_receives_404_on_someone_elses_scenario(): void
    {
        $owner = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);
        $scenario = Scenario::factory()->create(['user_id' => $owner->id]);

        $intruder = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($intruder)->get(route('scenarios.show', $scenario));

        $response->assertNotFound();
    }

    /**
     * @return array<string, mixed>
     */
    private function scenarioInputPayload(): array
    {
        return [
            'initialCapital' => 1000.0,
            'monthlyContribution' => 200.0,
            'annualRate' => 5.5,
            'years' => 10,
            'wrapperFee' => 0.6,
            'fundFee' => 0.3,
            'taxRate' => 12.8,
            'inflationRate' => 2.0,
            'inflationEnabled' => true,
            'wrapper' => 'pea',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function scenarioResultPayload(): array
    {
        return [
            'points' => [
                [
                    'year' => 0,
                    'contributions' => 1000.0,
                    'gross' => 1000.0,
                    'netReal' => 1000.0,
                    'netRealAdjusted' => 1000.0,
                ],
                [
                    'year' => 10,
                    'contributions' => 25000.0,
                    'gross' => 34567.89,
                    'netReal' => 31234.56,
                    'netRealAdjusted' => 29000.12,
                ],
            ],
            'invested' => 25000.0,
            'grossGains' => 9567.89,
            'finalGross' => 34567.89,
            'netRealGains' => 6234.56,
            'finalNetReal' => 31234.56,
            'finalNetRealAdjusted' => 29000.12,
            'shortfall' => 3333.33,
        ];
    }
}
