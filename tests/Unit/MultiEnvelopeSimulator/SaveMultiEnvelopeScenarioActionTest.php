<?php

namespace Tests\Unit\MultiEnvelopeSimulator;

use App\Modules\MultiEnvelopeSimulator\Actions\SaveMultiEnvelopeScenarioAction;
use App\Modules\MultiEnvelopeSimulator\Support\MultiEnvelopeScenarioPayload;
use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\DTOs\EnvelopeConfigData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationResultData;
use App\Modules\SimulationEngine\DTOs\PocketResultData;
use App\Modules\SimulationEngine\DTOs\YearlyResultData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Enums\TaxRegime;
use App\Modules\SimulationEngine\Support\EngineVersion;
use App\Modules\User\Models\User;
use Composer\InstalledVersions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaveMultiEnvelopeScenarioActionTest extends TestCase
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

        $action = new SaveMultiEnvelopeScenarioAction;
        $scenario = $action->handle($user, $input, $result);

        $this->assertDatabaseHas('scenarios', [
            'id' => $scenario->id,
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::MultiEnvelope->value,
            'engine_version' => EngineVersion::current(),
        ]);

        $stored = Scenario::findOrFail($scenario->id);

        $this->assertSame($user->id, $stored->user_id);
        $this->assertSame(CalculatorType::MultiEnvelope, $stored->calculator_type);
        $this->assertSame(MultiEnvelopeScenarioPayload::input($input), $stored->input_payload);
        $this->assertSame(MultiEnvelopeScenarioPayload::result($result), $stored->result_payload);
        $this->assertSame(EngineVersion::current(), $stored->engine_version);
    }

    public function test_it_persists_a_null_name_when_none_is_given(): void
    {
        $user = User::factory()->create();

        $action = new SaveMultiEnvelopeScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult());

        $this->assertNull($scenario->name);
    }

    public function test_it_persists_the_given_name_as_is(): void
    {
        $user = User::factory()->create();

        $action = new SaveMultiEnvelopeScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult(), 'Cascade PEA + CTO');

        $this->assertSame('Cascade PEA + CTO', $scenario->name);
    }

    public function test_it_returns_the_created_scenario_instance(): void
    {
        $user = User::factory()->create();

        $action = new SaveMultiEnvelopeScenarioAction;
        $scenario = $action->handle($user, $this->makeInput(), $this->makeResult());

        $this->assertInstanceOf(Scenario::class, $scenario);
        $this->assertTrue($scenario->exists);
    }

    /**
     * Every float below is deliberately non-whole (1000.42, not 1000.0):
     * Scenario::$input_payload/$result_payload round-trip through
     * json_encode/json_decode via Eloquent's 'array' cast, and a
     * whole-number float loses its float-ness on that trip (1000.0 becomes
     * the int 1000) — same pitfall documented in
     * ShowSingleEnvelopeSimulatorTest::normalizeForJsonComparison(). Using
     * fractional figures throughout sidesteps it instead of normalizing.
     */
    private function makeInput(): MultiEnvelopeCalculationInputData
    {
        return new MultiEnvelopeCalculationInputData(
            envelopes: [
                new EnvelopeConfigData(
                    accountType: AccountType::Pea,
                    initialAmount: 1000.42,
                    monthlyContribution: 200.15,
                    durationYears: 10,
                    annualReturnRate: 0.055,
                    terRate: 0.001,
                    brokerageFeeRate: 0.002,
                    managementFeeRate: 0.005,
                    custodyFeeRate: 0.003,
                    custodyFeeFixedMonthly: 1.5,
                    arbitrageFeeRate: 0.004,
                    arbitrageFeeFixed: 2.5,
                    inflationRate: 0.021,
                    customTaxRate: 0.314,
                ),
            ],
        );
    }

    private function makeResult(): MultiEnvelopeCalculationResultData
    {
        $year = new YearlyResultData(
            year: 10,
            totalDeposited: 25000.11,
            grossBalance: 27000.22,
            totalGains: 2000.33,
            taxesAmount: 372.44,
            netBalance: 26627.78,
            realNetBalanceWithInflation: 24000.55,
        );

        $pocket = new PocketResultData(
            accountType: AccountType::Pea,
            initialDeposit: 1000.42,
            dcaDeposited: 23999.69,
            totalDeposited: 25000.11,
            dcaMonthsCount: 120,
            lastDcaAmount: 200.15,
            firstResidualDcaAmount: 0.01,
            ceilingReachedMonth: null,
            grossBalance: 27000.22,
            totalGains: 2000.33,
            taxesAmount: 372.44,
            incomeTaxAmount: 0.01,
            socialLeviesAmount: 372.43,
            taxRegime: TaxRegime::SocialLeviesOnly,
            netBalance: 26627.78,
            brokerageFeesAmount: 1.11,
            managementFeesAmount: 2.22,
            terImpactAmount: 3.33,
            custodyFeesAmount: 4.44,
            arbitrageFeesAmount: 5.55,
        );

        return new MultiEnvelopeCalculationResultData(
            summary: $year,
            yearlyBreakdown: [$year],
            pockets: [$pocket],
            totalBrokerageFeesAmount: 1.11,
            totalManagementFeesAmount: 2.22,
            totalTerImpactAmount: 3.33,
            totalCustodyFeesAmount: 4.44,
            totalArbitrageFeesAmount: 5.55,
        );
    }
}
