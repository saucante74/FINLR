<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Actions\RunFireProjectionAction;
use App\Modules\SimulationEngine\Contracts\FireEngineInterface;
use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use RuntimeException;
use Tests\TestCase;

class RunFireProjectionActionTest extends TestCase
{
    public function test_it_rethrows_a_simulation_engine_unavailable_exception_with_the_original_cause_preserved(): void
    {
        $original = new RuntimeException('The private saucante74/finlr-engine package is not installed.');

        $this->app->bind(FireEngineInterface::class, function () use ($original): never {
            throw $original;
        });

        $action = new RunFireProjectionAction;

        try {
            $action->handle($this->makeInput());
            $this->fail('Expected a SimulationEngineUnavailableException to be thrown.');
        } catch (SimulationEngineUnavailableException $exception) {
            $this->assertSame($original, $exception->getPrevious());
        }
    }

    private function makeInput(): FireProjectionInputData
    {
        return new FireProjectionInputData(
            currentAge: 30,
            currentCapital: 10_000.0,
            monthlyContribution: 200.0,
            annualReturnRate: 0.06,
            desiredAnnualIncome: 20_000.0,
            withdrawalRate: 4.0,
        );
    }
}
