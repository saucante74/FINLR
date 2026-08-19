<?php

namespace Tests\Unit\Simulator;

use App\Modules\Simulator\DTOs\CalculationInputData;
use App\Modules\Simulator\Enums\TaxWrapper;
use App\Modules\Simulator\Services\DummyCalculatorEngine;
use PHPUnit\Framework\TestCase;

class DummyCalculatorEngineTest extends TestCase
{
    public function test_it_computes_gross_compound_growth(): void
    {
        $engine = new DummyCalculatorEngine;

        $result = $engine->calculate($this->makeInput(annualRate: 12.0, years: 1));

        $this->assertSame(1000.0, $result->invested);
        $this->assertEqualsWithDelta(1126.83, $result->finalGross, 0.01);
        $this->assertSame(0.0, $result->shortfall);
    }

    public function test_it_ignores_wrapper_fund_fees_and_tax_rate(): void
    {
        $engine = new DummyCalculatorEngine;

        $withoutCosts = $engine->calculate($this->makeInput(wrapperFee: 0.0, fundFee: 0.0, taxRate: 0.0));
        $withCosts = $engine->calculate($this->makeInput(wrapperFee: 2.0, fundFee: 2.0, taxRate: 30.0));

        $this->assertSame($withoutCosts->finalGross, $withCosts->finalGross);
        $this->assertSame($withoutCosts->finalNetReal, $withCosts->finalNetReal);
    }

    public function test_gross_and_net_real_are_equal_since_no_fiscal_rule_is_applied(): void
    {
        $engine = new DummyCalculatorEngine;

        $result = $engine->calculate($this->makeInput());

        $this->assertSame($result->finalGross, $result->finalNetReal);
        $this->assertSame($result->grossGains, $result->netRealGains);
    }

    public function test_it_adjusts_the_final_point_for_inflation_when_enabled(): void
    {
        $engine = new DummyCalculatorEngine;

        $result = $engine->calculate($this->makeInput(
            annualRate: 0.0,
            years: 1,
            inflationRate: 10.0,
            inflationEnabled: true,
        ));

        $this->assertEqualsWithDelta(909.09, $result->finalNetRealAdjusted, 0.01);
    }

    private function makeInput(
        float $initialCapital = 1000.0,
        float $monthlyContribution = 0.0,
        float $annualRate = 0.0,
        int $years = 1,
        float $wrapperFee = 0.0,
        float $fundFee = 0.0,
        float $taxRate = 0.0,
        float $inflationRate = 0.0,
        bool $inflationEnabled = false,
        TaxWrapper $wrapper = TaxWrapper::Cto,
    ): CalculationInputData {
        return new CalculationInputData(
            initialCapital: $initialCapital,
            monthlyContribution: $monthlyContribution,
            annualRate: $annualRate,
            years: $years,
            wrapperFee: $wrapperFee,
            fundFee: $fundFee,
            taxRate: $taxRate,
            inflationRate: $inflationRate,
            inflationEnabled: $inflationEnabled,
            wrapper: $wrapper,
        );
    }
}
