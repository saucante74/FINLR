<?php

namespace Tests\Unit\FireSimulator;

use App\Modules\FireSimulator\Actions\SaveFireScenarioAction;
use App\Modules\FireSimulator\Support\FireScenarioPayload;
use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use App\Modules\SimulationEngine\DTOs\FireProjectionResultData;
use App\Modules\SimulationEngine\DTOs\FireScenarioResultData;
use App\Modules\SimulationEngine\Support\EngineVersion;
use App\Modules\User\Models\User;
use Composer\InstalledVersions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaveFireScenarioActionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! InstalledVersions::isInstalled('saucante74/finlr-engine')) {
            $this->markTestSkipped('The private saucante74/finlr-engine package is not installed.');
        }
    }

    public function test_it_persists_a_scenario_with_the_expected_columns(): void
    {
        $user = User::factory()->create();
        $input = $this->makeInput();
        $result = $this->makeResult();

        $action = new SaveFireScenarioAction;
        $scenario = $action->handle($user, $input, $result);

        $this->assertDatabaseHas('scenarios', [
            'id' => $scenario->id,
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::Fire->value,
            'engine_version' => EngineVersion::current(),
        ]);

        $stored = Scenario::findOrFail($scenario->id);

        $this->assertSame($user->id, $stored->user_id);
        $this->assertSame(CalculatorType::Fire, $stored->calculator_type);
        $this->assertSame(FireScenarioPayload::input($input), $stored->input_payload);
        $this->assertSame(FireScenarioPayload::result($result), $stored->result_payload);
        $this->assertSame(EngineVersion::current(), $stored->engine_version);
    }

    public function test_it_persists_a_null_name_when_none_is_given(): void
    {
        $user = User::factory()->create();

        $action = new SaveFireScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult());

        $this->assertNull($scenario->name);
    }

    public function test_it_persists_the_given_name_as_is(): void
    {
        $user = User::factory()->create();

        $action = new SaveFireScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult(), 'Indépendance à 55 ans');

        $this->assertSame('Indépendance à 55 ans', $scenario->name);
    }

    public function test_it_returns_the_created_scenario_instance(): void
    {
        $user = User::factory()->create();

        $action = new SaveFireScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult());

        $this->assertInstanceOf(Scenario::class, $scenario);
        $this->assertTrue($scenario->exists);
    }

    public function test_it_persists_a_never_reached_target_as_null(): void
    {
        $user = User::factory()->create();
        $result = new FireProjectionResultData(
            requiredCapital: 500_000.11,
            retirementAge: null,
            yearsToRetirement: null,
            optimistic: new FireScenarioResultData(400_000.11, null, null),
            neutral: new FireScenarioResultData(500_000.11, null, null),
            pessimistic: new FireScenarioResultData(666_666.11, null, null),
        );

        $action = new SaveFireScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $result);

        $this->assertNull($scenario->result_payload['retirementAge']);
        $this->assertNull($scenario->result_payload['yearsToRetirement']);
        $this->assertNull($scenario->result_payload['optimistic']['retirementAge']);
    }

    private function makeInput(): FireProjectionInputData
    {
        return new FireProjectionInputData(
            currentAge: 30,
            currentCapital: 10_000.15,
            monthlyContribution: 500.15,
            annualReturnRate: 0.065,
            desiredAnnualIncome: 20_000.15,
            withdrawalRate: 4.15,
        );
    }

    /**
     * Every float below is deliberately non-whole: Scenario payload columns
     * round-trip through json_encode/json_decode via Eloquent's 'array'
     * cast, and a whole-number float loses its float-ness on that trip (see
     * SaveMultiEnvelopeScenarioActionTest for the same pitfall documented in
     * full).
     */
    private function makeResult(): FireProjectionResultData
    {
        return new FireProjectionResultData(
            requiredCapital: 500_000.11,
            retirementAge: 55.15,
            yearsToRetirement: 25.15,
            optimistic: new FireScenarioResultData(400_000.11, 52.15, 22.15),
            neutral: new FireScenarioResultData(500_000.11, 55.15, 25.15),
            pessimistic: new FireScenarioResultData(666_666.11, 59.15, 29.15),
        );
    }
}
