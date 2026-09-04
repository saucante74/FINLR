<?php

namespace App\Modules\AnalogySimulator\DTOs;

/**
 * Prefilled values for the shared block of the form (apport/DCA/durée/
 * rendement/frais/inflation, asked once for both scenarios — see
 * AnalogyComparisonInputData's own docblock). Same field set and same
 * figures as MultiEnvelopeSimulator's own defaults DTO — not shared
 * between the two modules, each simulator owns its defaults.
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
