<?php

namespace App\Modules\SimulationEngine\Actions;

use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\DTOs\CalculationResultData;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use RuntimeException;

/**
 * Shared entry point for any simulator that needs a projection: resolves
 * and calls the engine, converting its one known failure mode (the private
 * finlr-engine package being unresolvable — see
 * SimulationEngineServiceProvider) into a clean domain exception that
 * bootstrap/app.php renders centrally, instead of every simulator
 * controller repeating its own try/catch.
 */
class RunProjectionCalculationAction
{
    public function handle(CalculationInputData $input): CalculationResultData
    {
        try {
            return app(CalculateProjectionAction::class)->handle($input);
        } catch (RuntimeException $exception) {
            report($exception);

            throw new SimulationEngineUnavailableException(
                'The simulation engine could not be resolved or failed to compute a projection.',
                previous: $exception,
            );
        }
    }
}
