<?php

namespace App\Modules\SimulationEngine\Actions;

use App\Modules\SimulationEngine\Contracts\FireEngineInterface;
use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use App\Modules\SimulationEngine\DTOs\FireProjectionResultData;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use RuntimeException;

/**
 * Entry point for the FIRE projection facade, same pattern as
 * RunProjectionCalculationAction.
 */
class RunFireProjectionAction
{
    public function handle(FireProjectionInputData $input): FireProjectionResultData
    {
        try {
            return app(FireEngineInterface::class)->project($input);
        } catch (RuntimeException $exception) {
            report($exception);

            throw new SimulationEngineUnavailableException(
                'The simulation engine could not be resolved or failed to compute a FIRE projection.',
                previous: $exception,
            );
        }
    }
}
