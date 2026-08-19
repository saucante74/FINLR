<?php

namespace App\Modules\Simulator\Contracts;

use App\Modules\Simulator\DTOs\CalculationInputData;
use App\Modules\Simulator\DTOs\CalculationResultData;

interface SimulationEngineInterface
{
    public function calculate(CalculationInputData $input): CalculationResultData;
}
