<?php

namespace Tests\Unit\AnalogySimulator;

use App\Modules\AnalogySimulator\Actions\SaveAnalogyScenarioAction;
use App\Modules\AnalogySimulator\Support\AnalogyScenarioPayload;
use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\DTOs\AnalogyComparisonInputData;
use App\Modules\SimulationEngine\DTOs\AnalogyDeltaData;
use App\Modules\SimulationEngine\DTOs\AnalogyResultData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Enums\AnalogyLeader;
use App\Modules\SimulationEngine\Support\EngineVersion;
use App\Modules\User\Models\User;
use Composer\InstalledVersions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaveAnalogyScenarioActionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! InstalledVersions::isInstalled('saucante74/finlr-engine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    public function test_it_persists_a_scenario_with_the_expected_columns(): void
    {
        $user = User::factory()->create();
        $input = $this->makeInput();
        $result = $this->makeResult();

        $action = new SaveAnalogyScenarioAction;
        $scenario = $action->handle($user, $input, $result);

        $this->assertDatabaseHas('scenarios', [
            'id' => $scenario->id,
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::Analogy->value,
            'engine_version' => EngineVersion::current(),
        ]);

        $stored = Scenario::findOrFail($scenario->id);

        $this->assertSame($user->id, $stored->user_id);
        $this->assertSame(CalculatorType::Analogy, $stored->calculator_type);
        $this->assertSame(AnalogyScenarioPayload::input($input), $stored->input_payload);
        $this->assertSame(AnalogyScenarioPayload::result($result), $stored->result_payload);
        $this->assertSame(EngineVersion::current(), $stored->engine_version);
    }

    public function test_it_persists_a_null_name_when_none_is_given(): void
    {
        $user = User::factory()->create();

        $action = new SaveAnalogyScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult());

        $this->assertNull($scenario->name);
    }

    public function test_it_persists_the_given_name_as_is(): void
    {
        $user = User::factory()->create();

        $action = new SaveAnalogyScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult(), 'PEA vs CTO à 20 ans');

        $this->assertSame('PEA vs CTO à 20 ans', $scenario->name);
    }

    public function test_it_returns_the_created_scenario_instance(): void
    {
        $user = User::factory()->create();

        $action = new SaveAnalogyScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult());

        $this->assertInstanceOf(Scenario::class, $scenario);
        $this->assertTrue($scenario->exists);
    }

    private function makeInput(): AnalogyComparisonInputData
    {
        return new AnalogyComparisonInputData(
            accountTypeA: AccountType::Pea,
            accountTypeB: AccountType::Cto,
            initialAmount: 0.42,
            monthlyContribution: 1000.15,
            durationYears: 20,
            annualReturnRate: 0.065,
            terRate: 0.001,
            brokerageFeeRate: 0.002,
            managementFeeRate: 0.003,
            custodyFeeRate: 0.004,
            custodyFeeFixedMonthly: 1.5,
            arbitrageFeeRate: 0.005,
            arbitrageFeeFixed: 2.5,
            inflationRate: 0.021,
            labelA: 'PEA plafonné',
            labelB: 'CTO sans plafond',
        );
    }

    /**
     * Every float below is deliberately non-whole: Scenario payload columns
     * round-trip through json_encode/json_decode via Eloquent's 'array'
     * cast, and a whole-number float loses its float-ness on that trip
     * (see SaveMultiEnvelopeScenarioActionTest, Étape 2, for the same
     * pitfall documented in full).
     */
    private function makeResult(): AnalogyResultData
    {
        $delta = static fn (float $a, float $b): AnalogyDeltaData => new AnalogyDeltaData(
            valueA: $a,
            valueB: $b,
            absolute: $b - $a,
            percent: $a === 0.0 ? null : ($b - $a) / abs($a),
        );

        return new AnalogyResultData(
            labelA: 'PEA plafonné',
            labelB: 'CTO sans plafond',
            realNetBalanceWithInflation: $delta(100000.11, 105000.22),
            netBalance: $delta(110000.11, 115000.22),
            totalGains: $delta(20000.11, 25000.22),
            taxesAmount: $delta(3000.11, 4000.22),
            totalFees: $delta(500.11, 600.22),
            totalDeposited: $delta(240000.11, 245000.22),
            yearlyBreakdown: [],
            finalLeader: AnalogyLeader::ScenarioB,
            crossoverYears: [14],
        );
    }
}
