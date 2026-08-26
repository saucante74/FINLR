<?php

namespace Tests\Unit\SingleEnvelopeSimulator;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\DTOs\CalculationResultData;
use App\Modules\SimulationEngine\DTOs\CompoundPointData;
use App\Modules\SimulationEngine\Enums\TaxWrapper;
use App\Modules\SimulationEngine\Support\EngineVersion;
use App\Modules\SingleEnvelopeSimulator\Actions\SaveSingleEnvelopeScenarioAction;
use App\Modules\User\Models\User;
use Composer\InstalledVersions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaveSingleEnvelopeScenarioActionTest extends TestCase
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

        $action = new SaveSingleEnvelopeScenarioAction;
        $scenario = $action->handle($user, $input, $result);

        $this->assertDatabaseHas('scenarios', [
            'id' => $scenario->id,
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::SingleEnvelope->value,
            'engine_version' => EngineVersion::current(),
        ]);

        $stored = Scenario::findOrFail($scenario->id);

        $this->assertSame($user->id, $stored->user_id);
        $this->assertSame(CalculatorType::SingleEnvelope, $stored->calculator_type);
        $this->assertSame($input->toArray(), $stored->input_payload);
        $this->assertSame($result->toArray(), $stored->result_payload);
        $this->assertSame(EngineVersion::current(), $stored->engine_version);
    }

    public function test_it_persists_a_null_name_when_none_is_given(): void
    {
        $user = User::factory()->create();

        $action = new SaveSingleEnvelopeScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult());

        $this->assertNull($scenario->name);
    }

    public function test_it_persists_the_given_name_as_is(): void
    {
        $user = User::factory()->create();

        $action = new SaveSingleEnvelopeScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult(), 'Retraite à 62 ans');

        $this->assertSame('Retraite à 62 ans', $scenario->name);
    }

    public function test_it_returns_the_created_scenario_instance(): void
    {
        $user = User::factory()->create();

        $action = new SaveSingleEnvelopeScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult());

        $this->assertInstanceOf(Scenario::class, $scenario);
        $this->assertTrue($scenario->exists);
    }

    private function makeInput(): CalculationInputData
    {
        return new CalculationInputData(
            initialCapital: 1000.42,
            monthlyContribution: 200.15,
            annualRate: 5.5,
            years: 10,
            wrapperFee: 0.6,
            fundFee: 0.3,
            taxRate: 12.8,
            inflationRate: 2.1,
            inflationEnabled: true,
            wrapper: TaxWrapper::Pea,
        );
    }

    private function makeResult(): CalculationResultData
    {
        return new CalculationResultData(
            points: [
                new CompoundPointData(
                    year: 1,
                    contributions: 1200.33,
                    gross: 1250.44,
                    netReal: 1230.55,
                    netRealAdjusted: 1210.66,
                ),
            ],
            invested: 1200.33,
            grossGains: 50.11,
            finalGross: 1250.44,
            netRealGains: 30.22,
            finalNetReal: 1230.55,
            finalNetRealAdjusted: 1210.66,
            shortfall: 0.01,
        );
    }
}
