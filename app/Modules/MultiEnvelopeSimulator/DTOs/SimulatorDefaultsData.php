<?php

namespace App\Modules\MultiEnvelopeSimulator\DTOs;

/**
 * Prefilled values for the form: one envelope's worth of figures (used both
 * for the first row and for any row the user adds) plus the inflation rate,
 * which is entered once and shared by the whole cascade — only
 * envelopeConfigs[0]'s inflationRate is actually used by the engine
 * (docs/API.md §2), so the form never asks for it per envelope.
 */
readonly class SimulatorDefaultsData
{
    public function __construct(
        public float $initialAmount,
        public float $monthlyContribution,
        public int $durationYears,
        public float $annualReturnRate,
        public float $managementFeeRate,
        public float $inflationRate,
    ) {}

    public static function default(): self
    {
        return new self(
            initialAmount: 0.0,
            monthlyContribution: 300.0,
            durationYears: 15,
            annualReturnRate: 6.0,
            managementFeeRate: 0.5,
            inflationRate: 2.0,
        );
    }

    /**
     * @return array{
     *     initialAmount: float,
     *     monthlyContribution: float,
     *     durationYears: int,
     *     annualReturnRate: float,
     *     managementFeeRate: float,
     *     inflationRate: float,
     * }
     */
    public function toArray(): array
    {
        return [
            'initialAmount' => $this->initialAmount,
            'monthlyContribution' => $this->monthlyContribution,
            'durationYears' => $this->durationYears,
            'annualReturnRate' => $this->annualReturnRate,
            'managementFeeRate' => $this->managementFeeRate,
            'inflationRate' => $this->inflationRate,
        ];
    }
}
