<?php

namespace App\Modules\SingleEnvelopeSimulator\DTOs;

use App\Modules\SimulationEngine\Enums\TaxWrapper;

readonly class SimulatorDefaultsData
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

    public static function default(): self
    {
        return new self(
            initialCapital: 10000.0,
            monthlyContribution: 300.0,
            annualRate: 6.0,
            years: 15,
            wrapperFee: 0.5,
            fundFee: 0.3,
            taxRate: 30.0,
            inflationRate: 2.0,
            inflationEnabled: false,
            wrapper: TaxWrapper::Pea,
        );
    }

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
