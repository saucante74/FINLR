<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CalculatorPageTest extends TestCase
{
    public function test_home_page_is_accessible_and_renders_the_calculator_component(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('Calculator'));
    }

    public function test_home_page_exposes_authentication_route_availability(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('canLogin', true)
            ->where('canRegister', true)
        );
    }

    public function test_home_page_injects_the_financial_configuration(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn (Assert $page) => $page
            ->has('financial.defaults')
            ->has('financial.taxSuggestions', 3)
            ->where('financial.defaults.initialCapital', config('financial.defaults.initial_capital'))
            ->where('financial.defaults.monthlyContribution', config('financial.defaults.monthly_contribution'))
            ->where('financial.defaults.annualRate', config('financial.defaults.annual_rate'))
            ->where('financial.defaults.years', config('financial.defaults.years'))
            ->where('financial.defaults.wrapperFee', config('financial.defaults.wrapper_fee'))
            ->where('financial.defaults.fundFee', config('financial.defaults.fund_fee'))
            ->where('financial.defaults.taxRate', config('financial.defaults.tax_rate'))
        );
    }

    public function test_home_page_exposes_the_expected_tax_suggestions(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('financial.taxSuggestions.0', ['wrapper' => 'pea', 'rate' => config('financial.tax_suggestions.pea')])
            ->where('financial.taxSuggestions.1', ['wrapper' => 'av', 'rate' => config('financial.tax_suggestions.av')])
            ->where('financial.taxSuggestions.2', ['wrapper' => 'cto', 'rate' => config('financial.tax_suggestions.cto')])
        );
    }
}
