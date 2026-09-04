<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Actions\RunMultiEnvelopeCalculationAction;
use App\Modules\SimulationEngine\Contracts\MultiEnvelopeEngineInterface;
use App\Modules\SimulationEngine\DTOs\EnvelopeConfigData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use RuntimeException;
use Tests\TestCase;

class RunMultiEnvelopeCalculationActionTest extends TestCase
{
    public function test_it_rethrows_a_simulation_engine_unavailable_exception_with_the_original_cause_preserved(): void
    {
        $original = new RuntimeException('The private saucante74/finlr-engine package is not installed.');

        $this->app->bind(MultiEnvelopeEngineInterface::class, function () use ($original): never {
            throw $original;
        });

        $action = new RunMultiEnvelopeCalculationAction;

        try {
            $action->handle($this->makeInput());
            $this->fail('Expected a SimulationEngineUnavailableException to be thrown.');
        } catch (SimulationEngineUnavailableException $exception) {
            $this->assertSame($original, $exception->getPrevious());
        }
    }

    private function makeInput(): MultiEnvelopeCalculationInputData
    {
        return new MultiEnvelopeCalculationInputData(
            envelopes: [new EnvelopeConfigData(
                accountType: AccountType::Pea,
                initialAmount: 0.0,
                monthlyContribution: 100.0,
                durationYears: 5,
                annualReturnRate: 0.06,
                terRate: 0.0,
                brokerageFeeRate: 0.0,
                managementFeeRate: 0.0,
                custodyFeeRate: 0.0,
                custodyFeeFixedMonthly: 0.0,
                arbitrageFeeRate: 0.0,
                arbitrageFeeFixed: 0.0,
                inflationRate: 0.0,
            )],
        );
    }
}
