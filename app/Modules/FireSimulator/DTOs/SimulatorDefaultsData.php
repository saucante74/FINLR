<?php

namespace App\Modules\FireSimulator\DTOs;

/**
 * Prefilled values for FIRE's single input block — the 6 fields of
 * FireProjectionInput (docs/API.md §4). `annualReturnRate` and
 * `withdrawalRate` are both stored here as percentages (form-facing
 * convention shared with every other simulator); RunFireProjectionRequest
 * is the only place the annualReturnRate/100 conversion happens, and the
 * only one that must NOT touch withdrawalRate.
 */
readonly class SimulatorDefaultsData
{
    public function __construct(
        public int $currentAge,
        public float $currentCapital,
        public float $monthlyContribution,
        public float $annualReturnRate,
        public float $desiredAnnualIncome,
        public float $withdrawalRate,
    ) {}

    public static function default(): self
    {
        return new self(
            currentAge: 30,
            currentCapital: 10_000.0,
            monthlyContribution: 500.0,
            annualReturnRate: 6.0,
            desiredAnnualIncome: 24_000.0,
            withdrawalRate: 4.0,
        );
    }

    /**
     * @return array{
     *     currentAge: int,
     *     currentCapital: float,
     *     monthlyContribution: float,
     *     annualReturnRate: float,
     *     desiredAnnualIncome: float,
     *     withdrawalRate: float,
     * }
     */
    public function toArray(): array
    {
        return [
            'currentAge' => $this->currentAge,
            'currentCapital' => $this->currentCapital,
            'monthlyContribution' => $this->monthlyContribution,
            'annualReturnRate' => $this->annualReturnRate,
            'desiredAnnualIncome' => $this->desiredAnnualIncome,
            'withdrawalRate' => $this->withdrawalRate,
        ];
    }
}
