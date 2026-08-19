<?php

namespace Tests\Unit\PublicCalculator;

use App\Modules\PublicCalculator\DTOs\PublicCalculatorSettingsData;
use App\Modules\PublicCalculator\DTOs\TaxSuggestionData;
use Tests\TestCase;

class PublicCalculatorSettingsDataTest extends TestCase
{
    public function test_from_config_maps_snake_case_defaults_to_camel_case(): void
    {
        config()->set('financial.defaults', [
            'initial_capital' => 5000,
            'monthly_contribution' => 100,
            'annual_rate' => 5,
            'years' => 10,
            'wrapper_fee' => 0.4,
            'fund_fee' => 0.2,
            'tax_rate' => 18.6,
            'inflation_rate' => 2.0,
            'inflation_enabled' => false,
        ]);
        config()->set('financial.tax_suggestions', [
            'pea' => 18.6,
            'cto' => 31.4,
            'av' => 24.7,
        ]);

        $result = PublicCalculatorSettingsData::fromConfig()->toArray();

        $this->assertSame([
            'initialCapital' => 5000.0,
            'monthlyContribution' => 100.0,
            'annualRate' => 5.0,
            'years' => 10,
            'wrapperFee' => 0.4,
            'fundFee' => 0.2,
            'taxRate' => 18.6,
            'inflationRate' => 2.0,
            'inflationEnabled' => false,
        ], $result['defaults']);
    }

    public function test_from_config_orders_tax_suggestions_as_pea_av_cto(): void
    {
        config()->set('financial.tax_suggestions', [
            'pea' => 18.6,
            'cto' => 31.4,
            'av' => 24.7,
        ]);

        $result = PublicCalculatorSettingsData::fromConfig()->toArray();

        $this->assertSame([
            ['wrapper' => 'pea', 'rate' => 18.6],
            ['wrapper' => 'av', 'rate' => 24.7],
            ['wrapper' => 'cto', 'rate' => 31.4],
        ], $result['taxSuggestions']);
    }

    public function test_default_financial_config_matches_the_documented_rates(): void
    {
        $result = PublicCalculatorSettingsData::fromConfig()->toArray();

        $this->assertSame(18.6, $result['taxSuggestions'][0]['rate']);
        $this->assertSame(24.7, $result['taxSuggestions'][1]['rate']);
        $this->assertSame(31.4, $result['taxSuggestions'][2]['rate']);
    }

    public function test_it_exposes_typed_properties_instead_of_opaque_arrays(): void
    {
        $settings = PublicCalculatorSettingsData::fromConfig();

        $this->assertSame((float) config('financial.defaults.initial_capital'), $settings->defaults->initialCapital);
        $this->assertSame((int) config('financial.defaults.years'), $settings->defaults->years);
        $this->assertContainsOnlyInstancesOf(TaxSuggestionData::class, $settings->taxSuggestions);
    }
}
