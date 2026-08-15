<?php

namespace App\Modules\Calculator\Contracts;

use App\Modules\Calculator\DTOs\CalculationInputData;
use App\Modules\Calculator\DTOs\CalculationResultData;

interface CalculatorEngineInterface
{
    public function calculate(CalculationInputData $input): CalculationResultData;
}
