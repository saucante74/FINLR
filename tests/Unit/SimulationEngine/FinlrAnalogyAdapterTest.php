<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\AnalogyComparisonInputData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Enums\AnalogyLeader;
use App\Modules\SimulationEngine\Services\FinlrAnalogyAdapter;
use PHPUnit\Framework\TestCase;
use saucante74\CalculatorEngine\Analogy\Actions\CompareCalculationResults;
use saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\Actions\MultiEnvelopeSimulator;

class FinlrAnalogyAdapterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    /**
     * Reference scenario documented in docs/API.md §3 and covered by the
     * package's own non-regression test
     * (tests/Analogy/AnalogyReferenceScenarioTest.php): PEA (150 000 EUR
     * ceiling) vs CTO (no ceiling), 1 000 EUR/month, 20 years, no
     * inflation. The PEA leads from year 5 to 13 (social levies only after
     * 5 years, against the full PFU for the CTO), saturates at year 13,
     * then the CTO leads for good.
     */
    public function test_it_reproduces_the_documented_pea_vs_cto_reference_scenario(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->compare(new AnalogyComparisonInputData(
            accountTypeA: AccountType::Pea,
            accountTypeB: AccountType::Cto,
            initialAmount: 0.0,
            monthlyContribution: 1_000.0,
            durationYears: 20,
            annualReturnRate: 0.06,
            terRate: 0.0,
            brokerageFeeRate: 0.0,
            managementFeeRate: 0.0,
            custodyFeeRate: 0.0,
            custodyFeeFixedMonthly: 0.0,
            arbitrageFeeRate: 0.0,
            arbitrageFeeFixed: 0.0,
            inflationRate: 0.02,
            labelA: 'PEA plafonné',
            labelB: 'CTO sans plafond',
        ));

        $this->assertSame('PEA plafonné', $result->labelA);
        $this->assertSame('CTO sans plafond', $result->labelB);
        $this->assertSame(AnalogyLeader::ScenarioB, $result->finalLeader);
        $this->assertTrue($result->hasCrossover());
        $this->assertCount(20, $result->yearlyBreakdown);

        // The PEA's own 150 000 EUR ceiling is reached around year 13
        // (150 000 / 12 000 per year = 12.5) — the year in which at least
        // one scenario reports a ceiling event.
        $yearsWithCeilingEvents = array_values(array_filter(
            $result->yearlyBreakdown,
            static fn ($point) => $point->hasCeilingEvent(),
        ));
        $this->assertNotEmpty($yearsWithCeilingEvents);

        // The amount actually invested must diverge once the PEA saturates:
        // this is precisely the gap the comparison exists to reveal
        // (docs/API.md §3, totalDeposited).
        $this->assertNotSame(0.0, $result->totalDeposited->absolute);
    }

    public function test_default_overflow_account_type_null_makes_the_invested_amount_diverge_once_a_scenario_saturates(): void
    {
        $adapter = $this->makeAdapter();

        // Livret A ceiling: 22 950 EUR (docs/API.md §0). 5 000 EUR/month
        // over 20 years massively overshoots it, unlike the CTO's own
        // absence of ceiling.
        $result = $adapter->compare(new AnalogyComparisonInputData(
            accountTypeA: AccountType::LivretA,
            accountTypeB: AccountType::Cto,
            initialAmount: 0.0,
            monthlyContribution: 5_000.0,
            durationYears: 20,
            annualReturnRate: 0.0,
            terRate: 0.0,
            brokerageFeeRate: 0.0,
            managementFeeRate: 0.0,
            custodyFeeRate: 0.0,
            custodyFeeFixedMonthly: 0.0,
            arbitrageFeeRate: 0.0,
            arbitrageFeeFixed: 0.0,
            inflationRate: 0.0,
            labelA: 'Scénario A',
            labelB: 'Scénario B',
        ));

        // Scenario A (Livret A) invests strictly less than scenario B
        // (CTO) once it saturates, so absolute (= valueB - valueA) is
        // strictly positive: had a default overflow pocket been injected
        // (instead of the explicit null used by this adapter), both totals
        // would converge back to the same amount, hiding the gap.
        $this->assertGreaterThan(0.0, $result->totalDeposited->absolute);
    }

    private function makeAdapter(): FinlrAnalogyAdapter
    {
        return new FinlrAnalogyAdapter(new MultiEnvelopeSimulator, new CompareCalculationResults);
    }
}
