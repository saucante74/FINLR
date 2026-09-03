<?php

namespace App\Modules\SimulationEngine\DTOs;

use App\Modules\SimulationEngine\Enums\AnalogyLeader;

/**
 * Mirror of saucante74\CalculatorEngine\Analogy\DTOs\AnalogyResult
 * (docs/API.md §3): the gaps on the final totals, the yearly trajectory of
 * those gaps, and who leads — never advice, only data.
 */
readonly class AnalogyResultData
{
    /**
     * @param  list<AnalogyYearlyPointData>  $yearlyBreakdown
     * @param  list<int>  $crossoverYears
     */
    public function __construct(
        public string $labelA,
        public string $labelB,
        public AnalogyDeltaData $realNetBalanceWithInflation,
        public AnalogyDeltaData $netBalance,
        public AnalogyDeltaData $totalGains,
        public AnalogyDeltaData $taxesAmount,
        public AnalogyDeltaData $totalFees,
        public AnalogyDeltaData $totalDeposited,
        public array $yearlyBreakdown,
        public AnalogyLeader $finalLeader,
        public array $crossoverYears,
    ) {}

    public function hasCrossover(): bool
    {
        return $this->crossoverYears !== [];
    }
}
