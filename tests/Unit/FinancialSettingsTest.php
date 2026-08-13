<?php

namespace Tests\Unit;

use App\Domain\Financial\FinancialSettings;
use Tests\TestCase;

class FinancialSettingsTest extends TestCase
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
            'tax_rate' => 17.2,
        ]);
        config()->set('financial.tax_suggestions', [
            'pea' => 17.2,
            'cto' => 30,
            'av' => 24.7,
        ]);

        $result = FinancialSettings::fromConfig()->toArray();

        $this->assertSame([
            'initialCapital' => 5000,
            'monthlyContribution' => 100,
            'annualRate' => 5,
            'years' => 10,
            'wrapperFee' => 0.4,
            'fundFee' => 0.2,
            'taxRate' => 17.2,
        ], $result['defaults']);
    }

    public function test_from_config_orders_tax_suggestions_as_pea_av_cto(): void
    {
        config()->set('financial.tax_suggestions', [
            'pea' => 17.2,
            'cto' => 30,
            'av' => 24.7,
        ]);

        $result = FinancialSettings::fromConfig()->toArray();

        $this->assertSame([
            ['wrapper' => 'pea', 'rate' => 17.2],
            ['wrapper' => 'av', 'rate' => 24.7],
            ['wrapper' => 'cto', 'rate' => 30],
        ], $result['taxSuggestions']);
    }

    public function test_default_financial_config_matches_the_documented_rates(): void
    {
        $result = FinancialSettings::fromConfig()->toArray();

        $this->assertSame(17.2, $result['taxSuggestions'][0]['rate']);
        $this->assertSame(24.7, $result['taxSuggestions'][1]['rate']);
        $this->assertSame(30, $result['taxSuggestions'][2]['rate']);
    }
}
