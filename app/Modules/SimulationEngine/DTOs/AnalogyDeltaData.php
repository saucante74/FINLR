<?php

namespace App\Modules\SimulationEngine\DTOs;

/**
 * Mirror of saucante74\CalculatorEngine\Analogy\DTOs\AnalogyDelta
 * (docs/API.md §3): the gap between the two scenarios on one metric,
 * oriented B relative to A. `percent` is `null` — never `0.0` — when
 * `valueA` is exactly zero, per the package's own contract.
 */
readonly class AnalogyDeltaData
{
    public function __construct(
        public float $valueA,
        public float $valueB,
        public float $absolute,
        public ?float $percent,
    ) {}
}
