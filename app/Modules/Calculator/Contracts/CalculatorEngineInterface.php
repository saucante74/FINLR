<?php

namespace App\Modules\Calculator\Contracts;

use App\Modules\Calculator\DTOs\CalculationInputData;
use App\Modules\Calculator\DTOs\CalculationResultData;
use App\Modules\Calculator\DTOs\FreeCalculationInput;
use App\Modules\Calculator\DTOs\FreeCalculationResult;

interface CalculatorEngineInterface
{
    public function calculate(CalculationInputData $input): CalculationResultData;

    public function calculateFree(FreeCalculationInput $input): FreeCalculationResult;
}
