<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use App\Modules\SimulationEngine\Services\FinlrFireAdapter;
use PHPUnit\Framework\TestCase;
use saucante74\CalculatorEngine\Fire\FireCalculator;

class FinlrFireAdapterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    public function test_it_maps_a_reachable_target_end_to_end(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->project(new FireProjectionInputData(
            currentAge: 30,
            currentCapital: 10_000.0,
            monthlyContribution: 200.0,
            annualReturnRate: 0.06,
            desiredAnnualIncome: 20_000.0,
            withdrawalRate: 4.0,
        ));

        // requiredCapital = desiredAnnualIncome / (withdrawalRate / 100) is
        // the package's own publicly documented formula (docs/API.md §4),
        // not a duplication: it is asserted, not recomputed to derive the
        // capital used elsewhere in the assertion.
        $this->assertSame(500_000.0, $result->requiredCapital);
        $this->assertNotNull($result->retirementAge);
        $this->assertNotNull($result->yearsToRetirement);
        $this->assertGreaterThan(30.0, $result->retirementAge);
    }

    public function test_the_three_scenarios_are_ordered_by_withdrawal_rate(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->project(new FireProjectionInputData(
            currentAge: 30,
            currentCapital: 10_000.0,
            monthlyContribution: 500.0,
            annualReturnRate: 0.06,
            desiredAnnualIncome: 20_000.0,
            withdrawalRate: 4.0,
        ));

        // A higher withdrawal rate (optimistic) needs less capital, so it
        // is reached sooner than the base/neutral case, itself reached
        // sooner than the lower-rate (pessimistic) case.
        $this->assertLessThan($result->neutral->requiredCapital, $result->optimistic->requiredCapital);
        $this->assertLessThan($result->pessimistic->requiredCapital, $result->neutral->requiredCapital);
        $this->assertNotNull($result->optimistic->yearsToRetirement);
        $this->assertNotNull($result->neutral->yearsToRetirement);
        $this->assertNotNull($result->pessimistic->yearsToRetirement);
        $this->assertLessThan($result->neutral->yearsToRetirement, $result->optimistic->yearsToRetirement);
        $this->assertLessThan($result->pessimistic->yearsToRetirement, $result->neutral->yearsToRetirement);
    }

    public function test_neutral_scenario_matches_the_base_projection(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->project(new FireProjectionInputData(
            currentAge: 40,
            currentCapital: 0.0,
            monthlyContribution: 300.0,
            annualReturnRate: 0.05,
            desiredAnnualIncome: 15_000.0,
            withdrawalRate: 3.5,
        ));

        // Documented explicitly in docs/API.md §4: "neutral" reuses the
        // exact same withdrawal rate as the base projection.
        $this->assertSame($result->requiredCapital, $result->neutral->requiredCapital);
        $this->assertSame($result->retirementAge, $result->neutral->retirementAge);
        $this->assertSame($result->yearsToRetirement, $result->neutral->yearsToRetirement);
    }

    public function test_target_never_reached_yields_null_retirement_age_and_years(): void
    {
        $adapter = $this->makeAdapter();

        // No return, no contribution: the capital never grows, the target
        // is unreachable within the package's safety horizon.
        $result = $adapter->project(new FireProjectionInputData(
            currentAge: 30,
            currentCapital: 0.0,
            monthlyContribution: 0.0,
            annualReturnRate: 0.0,
            desiredAnnualIncome: 20_000.0,
            withdrawalRate: 4.0,
        ));

        $this->assertNull($result->retirementAge);
        $this->assertNull($result->yearsToRetirement);
    }

    public function test_target_already_met_yields_the_current_age_and_zero_years(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->project(new FireProjectionInputData(
            currentAge: 45,
            currentCapital: 1_000_000.0,
            monthlyContribution: 0.0,
            annualReturnRate: 0.06,
            desiredAnnualIncome: 20_000.0,
            withdrawalRate: 4.0,
        ));

        $this->assertSame(45.0, $result->retirementAge);
        $this->assertSame(0.0, $result->yearsToRetirement);
    }

    private function makeAdapter(): FinlrFireAdapter
    {
        return new FinlrFireAdapter(new FireCalculator);
    }
}
