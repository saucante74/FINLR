<?php

namespace App\Modules\SimulationEngine\DTOs;

/**
 * Mirror of saucante74\CalculatorEngine\Fire\DTOs\FireProjectionInput
 * (docs/API.md §4). `annualReturnRate` is a fraction (0.06 for 6%);
 * `withdrawalRate` is a percentage (4.0 for 4%) — the package's own
 * distinction, kept as-is rather than normalized, to avoid a silent
 * mismatch with the package's constructor invariants.
 */
readonly class FireProjectionInputData
{
    public function __construct(
        public int $currentAge,
        public float $currentCapital,
        public float $monthlyContribution,
        public float $annualReturnRate,
        public float $desiredAnnualIncome,
        public float $withdrawalRate,
    ) {}
}
