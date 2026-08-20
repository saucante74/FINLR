<?php

namespace App\Modules\SimulationEngine\DTOs;

use App\Modules\SimulationEngine\Enums\TaxWrapper;

readonly class CalculationInputData
{
    public function __construct(
        public float $initialCapital,
        public float $monthlyContribution,
        public float $annualRate,
        public int $years,
        public float $wrapperFee,
        public float $fundFee,
        public float $taxRate,
        public float $inflationRate,
        public bool $inflationEnabled,
        public TaxWrapper $wrapper,
    ) {}

    /**
     * @return array{
     *     initialCapital: float,
     *     monthlyContribution: float,
     *     annualRate: float,
     *     years: int,
     *     wrapperFee: float,
     *     fundFee: float,
     *     taxRate: float,
     *     inflationRate: float,
     *     inflationEnabled: bool,
     *     wrapper: string,
     * }
     */
    public function toArray(): array
    {
        return [
            'initialCapital' => $this->initialCapital,
            'monthlyContribution' => $this->monthlyContribution,
            'annualRate' => $this->annualRate,
            'years' => $this->years,
            'wrapperFee' => $this->wrapperFee,
            'fundFee' => $this->fundFee,
            'taxRate' => $this->taxRate,
            'inflationRate' => $this->inflationRate,
            'inflationEnabled' => $this->inflationEnabled,
            'wrapper' => $this->wrapper->value,
        ];
    }
}
