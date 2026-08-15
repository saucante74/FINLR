<?php

namespace App\Modules\Calculator\Actions;

use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\DTOs\FreeCalculationInput;
use App\Modules\Calculator\DTOs\FreeCalculationResult;

class CalculateFreeInvestmentAction
{
    public function __construct(private readonly CalculatorEngineInterface $engine) {}

    public function handle(FreeCalculationInput $input): FreeCalculationResult
    {
        return $this->engine->calculateFree($input);
    }
}
