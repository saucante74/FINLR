<?php

namespace Tests\Unit;

use App\Modules\Calculator\DTOs\CalculationInputData;
use App\Modules\Calculator\DTOs\FreeCalculationInput;
use App\Modules\Calculator\Enums\TaxWrapper;
use App\Modules\Calculator\Services\PrivateCalculatorEngineAdapter;
use PHPUnit\Framework\TestCase;
use saucante74\CalculatorEngine\CalculatorEngine;

class PrivateCalculatorEngineAdapterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    private function skipUnlessFreeCalculationIsSupported(): void
    {
        if (! method_exists(CalculatorEngine::class, 'calculateFree')) {
            $this->markTestSkipped('The installed saucante74\\CalculatorEngine package does not expose calculateFree() yet.');
        }
    }

    public function test_it_can_be_instantiated_once_the_private_package_is_installed(): void
    {
        $this->assertTrue(class_exists(PrivateCalculatorEngineAdapter::class));
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

    public function test_it_applies_wrapper_and_fund_fees_to_the_free_calculation(): void
    {
        $this->skipUnlessFreeCalculationIsSupported();

        $adapter = $this->makeAdapter();

        $withoutFees = $adapter->calculateFree($this->makeFreeInput(annualRate: 5.0, years: 5));
        $withFees = $adapter->calculateFree($this->makeFreeInput(annualRate: 5.0, years: 5, wrapperFee: 1.0, fundFee: 0.5));

        $this->assertSame($withoutFees->finalGross, $withFees->finalGross);
        $this->assertLessThan($withoutFees->finalNetReal, $withFees->finalNetReal);
    }

    public function test_it_applies_the_flat_tax_rate_to_positive_gains_in_the_free_calculation(): void
    {
        $this->skipUnlessFreeCalculationIsSupported();

        $adapter = $this->makeAdapter();

        $result = $adapter->calculateFree($this->makeFreeInput(annualRate: 5.0, years: 3, taxRate: 30.0));

        $this->assertEqualsWithDelta(
            $result->grossGains * 0.30,
            $result->finalGross - $result->finalNetReal,
            0.5,
        );
    }

    public function test_it_adjusts_the_free_calculation_for_inflation_when_enabled(): void
    {
        $this->skipUnlessFreeCalculationIsSupported();

        $adapter = $this->makeAdapter();

        $result = $adapter->calculateFree($this->makeFreeInput(
            annualRate: 0.0,
            years: 1,
            inflationRate: 10.0,
            inflationEnabled: true,
        ));

        $this->assertEqualsWithDelta($result->finalNetReal / 1.10, $result->finalNetRealAdjusted, 0.01);
    }

    private function makeAdapter(): PrivateCalculatorEngineAdapter
    {
        return new PrivateCalculatorEngineAdapter(new CalculatorEngine);
    }

    private function makeFreeInput(
        float $initialCapital = 1000.0,
        float $monthlyContribution = 100.0,
        float $annualRate = 0.0,
        int $years = 1,
        float $wrapperFee = 0.0,
        float $fundFee = 0.0,
        float $taxRate = 0.0,
        float $inflationRate = 0.0,
        bool $inflationEnabled = false,
    ): FreeCalculationInput {
        return new FreeCalculationInput(
            initialCapital: $initialCapital,
            monthlyContribution: $monthlyContribution,
            annualRate: $annualRate,
            years: $years,
            wrapperFee: $wrapperFee,
            fundFee: $fundFee,
            taxRate: $taxRate,
            inflationRate: $inflationRate,
            inflationEnabled: $inflationEnabled,
        );
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
