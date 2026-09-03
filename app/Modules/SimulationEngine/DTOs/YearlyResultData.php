<?php

namespace App\Modules\SimulationEngine\DTOs;

/**
 * Mirror of saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\DTOs\YearlyResult
 * (docs/API.md §2), one entry per simulated year.
 */
readonly class YearlyResultData
{
    public function __construct(
        public int $year,
        public float $totalDeposited,
        public float $grossBalance,
        public float $totalGains,
        public float $taxesAmount,
        public float $netBalance,
        public float $realNetBalanceWithInflation,
    ) {}
}
