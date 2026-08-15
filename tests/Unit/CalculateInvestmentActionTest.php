<?php

namespace Tests\Unit;

use App\Modules\Calculator\Actions\CalculateInvestmentAction;
use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\DTOs\CalculationInputData;
use App\Modules\Calculator\DTOs\CalculationResultData;
use App\Modules\Calculator\Enums\TaxWrapper;
use Mockery;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;

class CalculateInvestmentActionTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    public function test_it_delegates_the_calculation_to_the_injected_engine(): void
    {
        $input = new CalculationInputData(
            initialCapital: 1000.0,
            monthlyContribution: 0.0,
            annualRate: 0.0,
            years: 0,
            wrapperFee: 0.0,
            fundFee: 0.0,
            taxRate: 0.0,
            inflationRate: 0.0,
            inflationEnabled: false,
            wrapper: TaxWrapper::Cto,
        );

        $expected = new CalculationResultData(
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
        $engine->shouldReceive('calculate')->once()->with($input)->andReturn($expected);

        $action = new CalculateInvestmentAction($engine);

        $this->assertSame($expected, $action->handle($input));
    }
}
