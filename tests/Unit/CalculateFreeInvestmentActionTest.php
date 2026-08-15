<?php

namespace Tests\Unit;

use App\Modules\Calculator\Actions\CalculateFreeInvestmentAction;
use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\DTOs\FreeCalculationInput;
use App\Modules\Calculator\DTOs\FreeCalculationResult;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;

class CalculateFreeInvestmentActionTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_it_delegates_the_calculation_to_the_injected_engine(): void
    {
        $input = new FreeCalculationInput(
            initialCapital: 1000.0,
            monthlyContribution: 0.0,
            annualRate: 0.0,
            years: 0,
            wrapperFee: 0.0,
            fundFee: 0.0,
            taxRate: 0.0,
            inflationRate: 0.0,
            inflationEnabled: false,
        );

        $expected = new FreeCalculationResult(
            points: [],
            invested: 1000.0,
            grossGains: 0.0,
            finalGross: 1000.0,
            netRealGains: 0.0,
            finalNetReal: 1000.0,
            finalNetRealAdjusted: 1000.0,
            shortfall: 0.0,
        );

        $engine = Mockery::mock(CalculatorEngineInterface::class);
        $engine->shouldReceive('calculateFree')->once()->with($input)->andReturn($expected);

        $action = new CalculateFreeInvestmentAction($engine);

        $this->assertSame($expected, $action->handle($input));
    }
}
