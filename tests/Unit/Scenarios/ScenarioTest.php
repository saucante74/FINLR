<?php

namespace Tests\Unit\Scenarios;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScenarioTest extends TestCase
{
    use RefreshDatabase;

    public function test_calculator_type_is_cast_to_the_enum(): void
    {
        $scenario = Scenario::factory()->create();

        $this->assertInstanceOf(CalculatorType::class, $scenario->calculator_type);
        $this->assertSame(CalculatorType::SingleEnvelope, $scenario->calculator_type);
    }

    public function test_input_and_result_payloads_are_cast_to_arrays(): void
    {
        $scenario = Scenario::factory()->create([
            'input_payload' => ['years' => 10],
            'result_payload' => ['final_gross' => 12345.67],
        ]);

        $scenario->refresh();

        $this->assertIsArray($scenario->input_payload);
        $this->assertSame(['years' => 10], $scenario->input_payload);

        $this->assertIsArray($scenario->result_payload);
        $this->assertSame(['final_gross' => 12345.67], $scenario->result_payload);
    }

    public function test_it_belongs_to_a_user(): void
    {
        $user = User::factory()->create();
        $scenario = Scenario::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($scenario->user->is($user));
    }
}
