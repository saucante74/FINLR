<?php

namespace App\Modules\Simulator\DTOs;

readonly class CompoundPointData
{
    public function __construct(
        public int $year,
        public float $contributions,
        public float $gross,
        public float $netReal,
        public float $netRealAdjusted,
    ) {}
}
