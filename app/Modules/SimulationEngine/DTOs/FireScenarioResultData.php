<?php

namespace App\Modules\SimulationEngine\DTOs;

/**
 * Mirror of saucante74\CalculatorEngine\Fire\DTOs\FireScenarioResult
 * (docs/API.md §4): one complete FIRE projection for a given withdrawal
 * rate. `retirementAge`/`yearsToRetirement` are `null` only when the
 * target is never reached — never when it is already met (that case
 * yields the current age and `0.0`, per the package's documented
 * contract).
 */
readonly class FireScenarioResultData
{
    public function __construct(
        public float $requiredCapital,
        public ?float $retirementAge,
        public ?float $yearsToRetirement,
    ) {}
}
