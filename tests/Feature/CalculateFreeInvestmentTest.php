<?php

namespace Tests\Feature;

use Tests\TestCase;

class CalculateFreeInvestmentTest extends TestCase
{
    public function test_it_computes_the_free_calculation_from_valid_input(): void
    {
        $response = $this->postJson('/api/calculator/free', [
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
        $response->assertJsonStructure([
            'points',
            'invested',
            'grossGains',
            'finalGross',
            'netRealGains',
            'finalNetReal',
            'finalNetRealAdjusted',
            'shortfall',
        ]);
        $this->assertGreaterThan(1000, $response->json('finalGross'));
    }

    public function test_it_rejects_invalid_input(): void
    {
        $response = $this->postJson('/api/calculator/free', [
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

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['initial_capital']);
    }
}
