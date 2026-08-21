<?php

namespace Tests\Feature\SingleEnvelopeSimulator;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Composer\InstalledVersions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RunSingleEnvelopeSimulationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! InstalledVersions::isInstalled('saucante74/finlr-engine')) {
            $this->markTestSkipped('The private saucante74/finlr-engine package is not installed.');
        }
    }

    public function test_a_free_plan_user_receives_a_403(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::FREE]);

        $response = $this->actingAs($user)->post('/simulators/single-envelope', $this->validPayload());

        $response->assertForbidden();
        $this->assertDatabaseCount('scenarios', 0);
    }

    public function test_a_pro_plan_user_with_valid_data_gets_redirected_to_the_created_scenario(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($user)->post('/simulators/single-envelope', $this->validPayload());

        $this->assertDatabaseCount('scenarios', 1);

        $scenario = Scenario::sole();

        $response->assertRedirect(route('scenarios.show', $scenario, absolute: false));
        $this->assertSame($user->id, $scenario->user_id);
        $this->assertSame(CalculatorType::SingleEnvelope, $scenario->calculator_type);
    }

    public function test_a_pro_plan_user_with_invalid_data_gets_validation_errors_and_no_scenario_is_created(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($user)->post(
            '/simulators/single-envelope',
            array_merge($this->validPayload(), ['years' => -1]),
        );

        $response->assertSessionHasErrors('years');
        $this->assertDatabaseCount('scenarios', 0);
    }

    public function test_the_eleventh_request_within_a_minute_receives_a_429(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);
        $this->actingAs($user);

        for ($i = 0; $i < 10; $i++) {
            $response = $this->post('/simulators/single-envelope', $this->validPayload());
            $response->assertRedirect();
        }

        $eleventh = $this->post('/simulators/single-envelope', $this->validPayload());

        $eleventh->assertStatus(429);
    }

    /**
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        return [
            'initialCapital' => 1000,
            'monthlyContribution' => 200,
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
}
