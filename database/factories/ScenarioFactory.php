<?php

namespace Database\Factories;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Scenario>
 */
#[UseModel(Scenario::class)]
class ScenarioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'calculator_type' => CalculatorType::SingleEnvelope,
            'input_payload' => [
                'initial_amount' => 10000,
                'monthly_contribution' => 200,
                'years' => 10,
                'annual_rate' => 5.0,
            ],
            'result_payload' => [
                'final_gross' => 34567.89,
                'final_net_real' => 31234.56,
                'gross_gains' => 14567.89,
            ],
            'engine_version' => '2.0.0',
        ];
    }
}
