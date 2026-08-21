<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\Enums\TaxWrapper;
use PHPUnit\Framework\TestCase;

class CalculationInputDataTest extends TestCase
{
    public function test_to_array_produces_the_expected_keys_and_values(): void
    {
        $input = new CalculationInputData(
            initialCapital: 1000.0,
            monthlyContribution: 200.0,
            annualRate: 5.5,
            years: 10,
            wrapperFee: 0.6,
            fundFee: 0.3,
            taxRate: 12.8,
            inflationRate: 2.0,
            inflationEnabled: true,
            wrapper: TaxWrapper::Pea,
        );

        $this->assertSame([
            'initialCapital' => 1000.0,
            'monthlyContribution' => 200.0,
            'annualRate' => 5.5,
            'years' => 10,
            'wrapperFee' => 0.6,
            'fundFee' => 0.3,
            'taxRate' => 12.8,
            'inflationRate' => 2.0,
            'inflationEnabled' => true,
            'wrapper' => 'pea',
        ], $input->toArray());
    }
}
