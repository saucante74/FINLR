<?php

namespace App\Modules\PublicCalculator\DTOs;

/**
 * Default values pre-filled in the public calculator form on first render.
 */
readonly class PublicCalculatorDefaultsData
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
    ) {}

    public static function fromConfig(): self
    {
        return new self(
            initialCapital: (float) config('financial.defaults.initial_capital'),
            monthlyContribution: (float) config('financial.defaults.monthly_contribution'),
            annualRate: (float) config('financial.defaults.annual_rate'),
            years: (int) config('financial.defaults.years'),
            wrapperFee: (float) config('financial.defaults.wrapper_fee'),
            fundFee: (float) config('financial.defaults.fund_fee'),
            taxRate: (float) config('financial.defaults.tax_rate'),
            inflationRate: (float) config('financial.defaults.inflation_rate'),
            inflationEnabled: (bool) config('financial.defaults.inflation_enabled'),
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
        ];
    }
}
