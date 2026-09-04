<?php

namespace App\Modules\SimulationEngine\DTOs;

use App\Modules\SimulationEngine\Enums\AccountType;

/**
 * Mirror of saucante74\CalculatorEngine\Analogy\DTOs\CeilingEvent
 * (docs/API.md §3). `year` and `isReachedOnInitialDeposit` are plain
 * fields here rather than methods: the package already computes both
 * (`CeilingEvent::year()`, `::isReachedOnInitialDeposit()`) from
 * `reachedAtMonth`, so the adapter copies the computed values instead of
 * re-deriving them — avoiding a second, potentially diverging
 * implementation of that month-to-year mapping.
 */
readonly class CeilingEventData
{
    public function __construct(
        public AccountType $accountType,
        public int $reachedAtMonth,
        public ?float $ceiling,
        public int $year,
        public bool $isReachedOnInitialDeposit,
    ) {}
}
