<?php

namespace App\Modules\SimulationEngine\DTOs;

/**
 * Mirror of saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\DTOs\CalculationResult
 * (docs/API.md §1-2) — also the output of the mono-envelope entry point,
 * but this app already has a distinct CalculationResultData for that one
 * (FinlrEngineAdapter), so this DTO is dedicated to the multi-envelope
 * cascade.
 */
readonly class MultiEnvelopeCalculationResultData
{
    /**
     * @param  YearlyResultData[]  $yearlyBreakdown
     * @param  non-empty-array<int, PocketResultData>  $pockets
     */
    public function __construct(
        public YearlyResultData $summary,
        public array $yearlyBreakdown,
        public array $pockets,
        public float $totalBrokerageFeesAmount = 0.0,
        public float $totalManagementFeesAmount = 0.0,
        public float $totalTerImpactAmount = 0.0,
        public float $totalCustodyFeesAmount = 0.0,
        public float $totalArbitrageFeesAmount = 0.0,
    ) {}

    public function totalFeesAmount(): float
    {
        return $this->totalBrokerageFeesAmount
            + $this->totalManagementFeesAmount
            + $this->totalTerImpactAmount
            + $this->totalCustodyFeesAmount
            + $this->totalArbitrageFeesAmount;
    }

    public function firstPocket(): PocketResultData
    {
        return $this->pockets[0];
    }
}
