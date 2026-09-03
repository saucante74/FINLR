<?php

namespace App\Modules\SimulationEngine\Actions;

use App\Modules\SimulationEngine\Contracts\MultiEnvelopeEngineInterface;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationResultData;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use RuntimeException;

/**
 * Entry point for the multi-envelope cascade simulator: resolves
 * MultiEnvelopeEngineInterface lazily (inside the try block, so the
 * SimulationEngineServiceProvider's own RuntimeException — the private
 * finlr-engine package missing — is caught here too, not just a calculate()
 * failure) and converts it into a clean domain exception, same pattern as
 * RunProjectionCalculationAction.
 */
class RunMultiEnvelopeCalculationAction
{
    public function handle(MultiEnvelopeCalculationInputData $input): MultiEnvelopeCalculationResultData
    {
        try {
            return app(MultiEnvelopeEngineInterface::class)->calculate($input);
        } catch (RuntimeException $exception) {
            report($exception);

            throw new SimulationEngineUnavailableException(
                'The simulation engine could not be resolved or failed to compute a multi-envelope projection.',
                previous: $exception,
            );
        }
    }
}
