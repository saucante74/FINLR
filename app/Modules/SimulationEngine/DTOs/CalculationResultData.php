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

    /**
     * @return array{
     *     points: list<array{year: int, contributions: float, gross: float, netReal: float, netRealAdjusted: float}>,
     *     invested: float,
     *     grossGains: float,
     *     finalGross: float,
     *     netRealGains: float,
     *     finalNetReal: float,
     *     finalNetRealAdjusted: float,
     *     shortfall: float,
     * }
     */
    public function toArray(): array
    {
        return [
            'points' => array_map(
                static fn (CompoundPointData $point): array => $point->toArray(),
                $this->points,
            ),
            'invested' => $this->invested,
            'grossGains' => $this->grossGains,
            'finalGross' => $this->finalGross,
            'netRealGains' => $this->netRealGains,
            'finalNetReal' => $this->finalNetReal,
            'finalNetRealAdjusted' => $this->finalNetRealAdjusted,
            'shortfall' => $this->shortfall,
        ];
    }
}
