<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Actions\RunProjectionCalculationAction;
use App\Modules\SimulationEngine\Contracts\SimulationEngineInterface;
use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\Enums\TaxWrapper;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use RuntimeException;
use Tests\TestCase;

class RunProjectionCalculationActionTest extends TestCase
{
    public function test_it_rethrows_a_simulation_engine_unavailable_exception_with_the_original_cause_preserved(): void
    {
        $original = new RuntimeException('The private saucante74/finlr-engine package is not installed.');

        $this->app->bind(SimulationEngineInterface::class, function () use ($original): never {
            throw $original;
        });

        $action = new RunProjectionCalculationAction;

        try {
            $action->handle($this->makeInput());
            $this->fail('Expected a SimulationEngineUnavailableException to be thrown.');
        } catch (SimulationEngineUnavailableException $exception) {
            $this->assertSame($original, $exception->getPrevious());
        }
    }

    private function makeInput(): CalculationInputData
    {
        return new CalculationInputData(
            initialCapital: 1000.0,
            monthlyContribution: 100.0,
            annualRate: 5.0,
            years: 5,
            wrapperFee: 0.0,
            fundFee: 0.0,
            taxRate: 0.0,
            inflationRate: 0.0,
            inflationEnabled: false,
            wrapper: TaxWrapper::Cto,
        );
    }
}
