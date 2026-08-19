<?php

namespace App\Modules\Simulator\Actions;

use App\Modules\Simulator\Contracts\SimulationEngineInterface;
use App\Modules\Simulator\DTOs\CalculationInputData;
use App\Modules\Simulator\DTOs\CalculationResultData;

class CalculateProjectionAction
{
    public function __construct(private readonly SimulationEngineInterface $engine) {}

    public function handle(CalculationInputData $input): CalculationResultData
    {
        return $this->engine->calculate($input);
    }
}
