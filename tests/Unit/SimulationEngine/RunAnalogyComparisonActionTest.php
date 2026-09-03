<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Actions\RunAnalogyComparisonAction;
use App\Modules\SimulationEngine\Contracts\AnalogyEngineInterface;
use App\Modules\SimulationEngine\DTOs\AnalogyComparisonInputData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use RuntimeException;
use Tests\TestCase;

class RunAnalogyComparisonActionTest extends TestCase
{
    public function test_it_rethrows_a_simulation_engine_unavailable_exception_with_the_original_cause_preserved(): void
    {
        $original = new RuntimeException('The private saucante74/finlr-engine package is not installed.');

        $this->app->bind(AnalogyEngineInterface::class, function () use ($original): never {
            throw $original;
        });

        $action = new RunAnalogyComparisonAction;

        try {
            $action->handle($this->makeInput());
            $this->fail('Expected a SimulationEngineUnavailableException to be thrown.');
        } catch (SimulationEngineUnavailableException $exception) {
            $this->assertSame($original, $exception->getPrevious());
        }
    }

    private function makeInput(): AnalogyComparisonInputData
    {
        return new AnalogyComparisonInputData(
            accountTypeA: AccountType::Pea,
            accountTypeB: AccountType::Cto,
            initialAmount: 0.0,
            monthlyContribution: 1000.0,
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
            labelA: 'Scénario A',
            labelB: 'Scénario B',
        );
    }
}
