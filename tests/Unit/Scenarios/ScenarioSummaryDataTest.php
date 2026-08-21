<?php

namespace Tests\Unit\Scenarios;

use App\Modules\Scenarios\DTOs\ScenarioSummaryData;
use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScenarioSummaryDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_from_model_extracts_the_four_expected_fields(): void
    {
        $scenario = Scenario::factory()->create([
            'calculator_type' => CalculatorType::SingleEnvelope,
            'result_payload' => $this->realisticResultPayload(),
        ]);

        $summary = ScenarioSummaryData::fromModel($scenario);

        $this->assertSame($scenario->id, $summary->id);
        $this->assertSame(CalculatorType::SingleEnvelope, $summary->calculatorType);
        $this->assertSame(31234.56, $summary->headlineFigure);
        $this->assertTrue($scenario->created_at->equalTo($summary->createdAt));
    }

    public function test_to_array_produces_the_expected_shape(): void
    {
        $scenario = Scenario::factory()->create([
            'calculator_type' => CalculatorType::SingleEnvelope,
            'result_payload' => $this->realisticResultPayload(),
        ]);

        $array = ScenarioSummaryData::fromModel($scenario)->toArray();

        $this->assertSame([
            'id' => $scenario->id,
            'calculatorType' => 'single_envelope',
            'headlineFigure' => 31234.56,
            'createdAt' => $scenario->created_at->toISOString(),
        ], $array);
    }

    /**
     * A production result_payload, keyed like CalculationResultData::toArray()
     * (camelCase) — unlike ScenarioFactory's own default, which predates
     * this shape and still uses snake_case keys.
     *
     * @return array<string, mixed>
     */
    private function realisticResultPayload(): array
    {
        return [
            'points' => [],
            'invested' => 25000.0,
            'grossGains' => 9567.89,
            'finalGross' => 34567.89,
            'netRealGains' => 6234.56,
            'finalNetReal' => 31234.56,
            'finalNetRealAdjusted' => 29000.12,
            'shortfall' => 3333.33,
        ];
    }
}
