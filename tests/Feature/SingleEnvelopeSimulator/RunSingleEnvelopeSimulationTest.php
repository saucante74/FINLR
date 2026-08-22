<?php

namespace Tests\Feature\SingleEnvelopeSimulator;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\Contracts\SimulationEngineInterface;
use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Composer\InstalledVersions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
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

    public function test_a_scenario_created_without_a_name_has_name_null_in_the_database(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $this->actingAs($user)->post('/simulators/single-envelope', $this->validPayload());

        $scenario = Scenario::sole();

        $this->assertNull($scenario->name);
    }

    public function test_a_scenario_created_with_a_name_stores_it_as_is(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $this->actingAs($user)->post(
            '/simulators/single-envelope',
            array_merge($this->validPayload(), ['name' => 'Retraite à 62 ans']),
        );

        $scenario = Scenario::sole();

        $this->assertSame('Retraite à 62 ans', $scenario->name);
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

    public function test_a_post_with_the_av_wrapper_is_rejected_by_the_plain_enum_rule(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        // TaxWrapper no longer has an Av case, so Rule::enum(TaxWrapper::class)
        // rejects 'av' on its own — no dedicated validation code for this case.
        //
        // Not a 422: bootstrap/app.php's shouldRenderJsonWhen() renders JSON
        // exceptions only for `api/*` routes, so this web route's
        // ValidationException always redirects (302) with flashed session
        // errors, Accept header notwithstanding — verified directly against
        // the running app rather than assumed.
        $response = $this->actingAs($user)->postJson(
            '/simulators/single-envelope',
            array_merge($this->validPayload(), ['wrapper' => 'av']),
        );

        $response->assertRedirect();
        $response->assertSessionHasErrors('wrapper');
        $this->assertDatabaseCount('scenarios', 0);
    }

    public function test_a_container_resolution_failure_redirects_with_a_flashed_error_instead_of_a_500(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        // Simulates SimulationEngineServiceProvider's own failure mode (the
        // private finlr-engine package missing) without depending on it
        // actually being absent from this environment.
        $this->app->bind(SimulationEngineInterface::class, function (): never {
            throw new RuntimeException('The private saucante74/finlr-engine package is not installed.');
        });

        $response = $this->actingAs($user)->post('/simulators/single-envelope', $this->validPayload());

        $response->assertRedirect();
        $response->assertSessionHasErrors('simulation');
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
