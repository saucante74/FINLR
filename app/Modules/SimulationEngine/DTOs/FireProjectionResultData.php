<?php

namespace App\Modules\SimulationEngine\DTOs;

/**
 * Mirror of saucante74\CalculatorEngine\Fire\DTOs\FireProjectionResult
 * (docs/API.md §4): the base projection (at the withdrawal rate supplied
 * by the caller) plus three full scenarios (withdrawal rate ±1 point,
 * floored at 0.1).
 */
readonly class FireProjectionResultData
{
    public function __construct(
        public float $requiredCapital,
        public ?float $retirementAge,
        public ?float $yearsToRetirement,
        public FireScenarioResultData $optimistic,
        public FireScenarioResultData $neutral,
        public FireScenarioResultData $pessimistic,
    ) {}
}
