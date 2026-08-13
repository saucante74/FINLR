<?php

namespace App\Modules\FinancialTools\Support;

class FinancialSettings
{
    public function __construct(
        private readonly array $taxSuggestions,
        private readonly array $defaults,
    ) {}

    public static function fromConfig(): self
    {
        return new self(
            config('financial.tax_suggestions'),
            config('financial.defaults'),
        );
    }

    public function toArray(): array
    {
        return [
            'defaults' => [
                'initialCapital' => $this->defaults['initial_capital'],
                'monthlyContribution' => $this->defaults['monthly_contribution'],
                'annualRate' => $this->defaults['annual_rate'],
                'years' => $this->defaults['years'],
                'wrapperFee' => $this->defaults['wrapper_fee'],
                'fundFee' => $this->defaults['fund_fee'],
                'taxRate' => $this->defaults['tax_rate'],
            ],
            'taxSuggestions' => [
                ['wrapper' => 'pea', 'rate' => $this->taxSuggestions['pea']],
                ['wrapper' => 'av', 'rate' => $this->taxSuggestions['av']],
                ['wrapper' => 'cto', 'rate' => $this->taxSuggestions['cto']],
            ],
        ];
    }
}
