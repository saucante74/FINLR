<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CalculateFreeInvestmentTest extends TestCase
{
    public function test_it_computes_the_free_calculation_from_valid_input(): void
    {
        $response = $this->post('/calculator/free', [
            'initial_capital' => 1000,
            'monthly_contribution' => 100,
            'annual_rate' => 5,
            'years' => 3,
            'wrapper_fee' => 0,
            'fund_fee' => 0,
            'tax_rate' => 0,
            'inflation_rate' => 0,
            'inflation_enabled' => false,
        ]);

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Calculator')
            ->has('freeResult.points')
            ->has('freeResult.finalGross')
            ->where('freeResult.finalGross', fn (float $finalGross) => $finalGross > 1000)
        );
    }

    public function test_it_rejects_invalid_input(): void
    {
        $response = $this->post('/calculator/free', [
            'initial_capital' => -100,
            'monthly_contribution' => 100,
            'annual_rate' => 5,
            'years' => 3,
            'wrapper_fee' => 0,
            'fund_fee' => 0,
            'tax_rate' => 0,
            'inflation_rate' => 0,
            'inflation_enabled' => false,
        ]);

        $response->assertInvalid(['initial_capital']);
    }
}
