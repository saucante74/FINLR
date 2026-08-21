<?php

namespace App\Modules\SimulationEngine\Actions;

use App\Modules\SimulationEngine\Contracts\SimulationEngineInterface;
use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\DTOs\CalculationResultData;

class CalculateProjectionAction
{
    public function __construct(private readonly SimulationEngineInterface $engine) {}

    public function handle(CalculationInputData $input): CalculationResultData
    {
        return $this->engine->calculate($input);
    }
}
