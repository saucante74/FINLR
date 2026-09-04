<?php

namespace App\Modules\SimulationEngine\Actions;

use App\Modules\SimulationEngine\Contracts\AnalogyEngineInterface;
use App\Modules\SimulationEngine\DTOs\AnalogyComparisonInputData;
use App\Modules\SimulationEngine\DTOs\AnalogyResultData;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use RuntimeException;

/**
 * Entry point for the Analogy comparator, same pattern as
 * RunProjectionCalculationAction.
 */
class RunAnalogyComparisonAction
{
    public function handle(AnalogyComparisonInputData $input): AnalogyResultData
    {
        try {
            return app(AnalogyEngineInterface::class)->compare($input);
        } catch (RuntimeException $exception) {
            report($exception);

            throw new SimulationEngineUnavailableException(
                'The simulation engine could not be resolved or failed to compute an analogy comparison.',
                previous: $exception,
            );
        }
    }
}
