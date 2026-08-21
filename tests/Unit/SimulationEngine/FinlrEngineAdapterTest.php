<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\Enums\TaxWrapper;
use App\Modules\SimulationEngine\Services\FinlrEngineAdapter;
use PHPUnit\Framework\TestCase;
use saucante74\CalculatorEngine\CalculatorEngine;

class FinlrEngineAdapterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    public function test_it_can_be_instantiated_once_the_private_package_is_installed(): void
    {
        $this->assertTrue(class_exists(FinlrEngineAdapter::class));
    }

    public function test_it_applies_the_pea_flat_rate_when_the_holding_period_is_short(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 3,
            annualRate: 5.0,
            wrapper: TaxWrapper::Pea,
        ));

        $this->assertEqualsWithDelta($result->grossGains * 0.314, $result->finalGross - $result->finalNetReal, 0.01);
    }

    public function test_it_applies_the_pea_preferential_rate_after_five_years(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 6,
            annualRate: 5.0,
            wrapper: TaxWrapper::Pea,
        ));

        $this->assertEqualsWithDelta($result->grossGains * 0.186, $result->finalGross - $result->finalNetReal, 0.01);
    }

    public function test_it_applies_the_cto_flat_rate_regardless_of_duration(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 2,
            annualRate: 5.0,
            wrapper: TaxWrapper::Cto,
        ));

        $this->assertEqualsWithDelta($result->grossGains * 0.314, $result->finalGross - $result->finalNetReal, 0.01);
    }

    public function test_it_adjusts_the_final_balance_for_inflation_when_enabled(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 1,
            annualRate: 0.0,
            inflationRate: 10.0,
            inflationEnabled: true,
            wrapper: TaxWrapper::Cto,
        ));

        $this->assertEqualsWithDelta($result->finalNetReal / 1.10, $result->finalNetRealAdjusted, 0.01);
    }

    public function test_it_ignores_inflation_when_disabled(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 1,
            annualRate: 0.0,
            inflationRate: 10.0,
            inflationEnabled: false,
            wrapper: TaxWrapper::Cto,
        ));

        $this->assertEqualsWithDelta($result->finalNetReal, $result->finalNetRealAdjusted, 0.01);
    }

    public function test_it_computes_shortfall_as_the_gap_between_gross_and_net_real_gains(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 6,
            annualRate: 5.0,
            wrapper: TaxWrapper::Pea,
        ));

        // The private engine computes grossGains/netRealGains internally (tax
        // rules included), so there is no independent formula to hand-compute
        // an expected number without duplicating that engine logic — forbidden
        // by this project's rules. Like the other tests in this file, the
        // assertion instead checks the relationship the fix is meant to
        // restore: shortfall must equal the gap it is documented to measure.
        $this->assertGreaterThan(0.0, $result->shortfall);
        $this->assertEqualsWithDelta($result->grossGains - $result->netRealGains, $result->shortfall, 0.01);
    }

    public function test_shortfall_is_never_negative_when_gains_are_positive(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 6,
            annualRate: 5.0,
            wrapper: TaxWrapper::Pea,
        ));

        // The net result can never exceed the gross one, whatever the tax
        // rules applied internally by the engine.
        $this->assertGreaterThanOrEqual(0.0, $result->shortfall);
    }

    public function test_shortfall_never_exceeds_the_gross_gains(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 6,
            annualRate: 5.0,
            wrapper: TaxWrapper::Pea,
        ));

        // You cannot lose more to tax/fees than you gained: the shortfall is
        // a share of grossGains, never more than the whole of it.
        $this->assertLessThanOrEqual($result->grossGains, $result->shortfall);
    }

    public function test_it_matches_the_publicly_documented_pea_preferential_rate_after_five_years(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate($this->makeInput(
            years: 6,
            annualRate: 5.0,
            wrapper: TaxWrapper::Pea,
        ));

        // 18.6% is the PEA rate for holdings >= 5 years under the 150,000€
        // ceiling, as documented in vendor/saucante74/finlr-engine/README.md
        // ("Durée ≥ 5 ans et versements ≤ 150 000 € | 18,6 %"). This is the
        // package's public contract, not a reimplementation of its internal
        // tax logic — the test data (1,000€ initial + 100€/month over 6
        // years) stays far under the ceiling.
        $this->assertEqualsWithDelta($result->grossGains * (1 - 0.186), $result->netRealGains, 0.01);
    }

    private function makeAdapter(): FinlrEngineAdapter
    {
        return new FinlrEngineAdapter(new CalculatorEngine);
    }

    private function makeInput(
        float $initialCapital = 1000.0,
        float $monthlyContribution = 100.0,
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
