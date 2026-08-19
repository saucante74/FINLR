<?php

namespace App\Modules\PublicCalculator\DTOs;

/**
 * Everything the public calculator page needs from config/financial.php.
 *
 * toArray() is the single, explicit boundary where these typed values become
 * the camelCase structure Inertia serialises into the page props; the shape is
 * described by an array shape so static analysis checks it like any other type.
 */
readonly class PublicCalculatorSettingsData
{
    /**
     * @param  list<TaxSuggestionData>  $taxSuggestions
     */
    public function __construct(
        public PublicCalculatorDefaultsData $defaults,
        public array $taxSuggestions,
    ) {}

    public static function fromConfig(): self
    {
        return new self(
            defaults: PublicCalculatorDefaultsData::fromConfig(),
            taxSuggestions: [
                new TaxSuggestionData('pea', (float) config('financial.tax_suggestions.pea')),
                new TaxSuggestionData('av', (float) config('financial.tax_suggestions.av')),
                new TaxSuggestionData('cto', (float) config('financial.tax_suggestions.cto')),
            ],
        );
    }

    /**
     * @return array{
     *     defaults: array{
     *         initialCapital: float,
     *         monthlyContribution: float,
     *         annualRate: float,
     *         years: int,
     *         wrapperFee: float,
     *         fundFee: float,
     *         taxRate: float,
     *         inflationRate: float,
     *         inflationEnabled: bool,
     *     },
     *     taxSuggestions: list<array{wrapper: string, rate: float}>,
     * }
     */
    public function toArray(): array
    {
        return [
            'defaults' => $this->defaults->toArray(),
            'taxSuggestions' => array_map(
                fn (TaxSuggestionData $suggestion): array => $suggestion->toArray(),
                $this->taxSuggestions,
            ),
        ];
    }
}
