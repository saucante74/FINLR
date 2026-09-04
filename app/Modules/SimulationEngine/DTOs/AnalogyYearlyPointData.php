<?php

namespace App\Modules\SimulationEngine\DTOs;

use App\Modules\SimulationEngine\Enums\AnalogyLeader;

/**
 * Mirror of saucante74\CalculatorEngine\Analogy\DTOs\AnalogyYearlyPoint
 * (docs/API.md §3): the gap between the two scenarios for one year, plus
 * the ceiling saturations that occurred that same year.
 */
readonly class AnalogyYearlyPointData
{
    /**
     * @param  CeilingEventData[]  $ceilingEventsA
     * @param  CeilingEventData[]  $ceilingEventsB
     */
    public function __construct(
        public int $year,
        public AnalogyDeltaData $netBalance,
        public AnalogyDeltaData $realNetBalanceWithInflation,
        public AnalogyDeltaData $totalDeposited,
        public AnalogyLeader $leader,
        public array $ceilingEventsA,
        public array $ceilingEventsB,
    ) {}

    public function hasCeilingEvent(): bool
    {
        return $this->ceilingEventsA !== [] || $this->ceilingEventsB !== [];
    }
}
