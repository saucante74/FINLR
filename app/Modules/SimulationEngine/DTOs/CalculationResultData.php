<?php

namespace App\Modules\SimulationEngine\DTOs;

readonly class CalculationResultData
{
    /**
     * @param  array<int, CompoundPointData>  $points
     */
    public function __construct(
        public array $points,
        public float $invested,
        public float $grossGains,
        public float $finalGross,
        public float $netRealGains,
        public float $finalNetReal,
        public float $finalNetRealAdjusted,
        public float $shortfall,
    ) {}
}
