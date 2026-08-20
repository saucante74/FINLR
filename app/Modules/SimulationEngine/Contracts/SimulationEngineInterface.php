<?php

namespace App\Modules\SimulationEngine\Contracts;

use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\DTOs\CalculationResultData;

interface SimulationEngineInterface
{
    public function calculate(CalculationInputData $input): CalculationResultData;
}
