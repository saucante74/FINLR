<?php

namespace App\Modules\Calculator\Actions;

use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\DTOs\CalculationInputData;
use App\Modules\Calculator\DTOs\CalculationResultData;

class CalculateInvestmentAction
{
    public function __construct(private readonly CalculatorEngineInterface $engine) {}

    public function handle(CalculationInputData $input): CalculationResultData
    {
        return $this->engine->calculate($input);
    }
}
