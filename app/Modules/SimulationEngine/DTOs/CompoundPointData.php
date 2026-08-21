<?php

namespace App\Modules\SimulationEngine\DTOs;

readonly class CompoundPointData
{
    public function __construct(
        public int $year,
        public float $contributions,
        public float $gross,
        public float $netReal,
        public float $netRealAdjusted,
    ) {}

    /**
     * @return array{year: int, contributions: float, gross: float, netReal: float, netRealAdjusted: float}
     */
    public function toArray(): array
    {
        return [
            'year' => $this->year,
            'contributions' => $this->contributions,
            'gross' => $this->gross,
            'netReal' => $this->netReal,
            'netRealAdjusted' => $this->netRealAdjusted,
        ];
    }
}
