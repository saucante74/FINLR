<?php

namespace App\Modules\Scenarios\DTOs;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use Carbon\Carbon;

/**
 * Lightweight summary of a Scenario for list views (dashboard) that don't
 * need the full input/result payloads — those stay behind the existing
 * /scenarios/{id} detail page.
 */
readonly class ScenarioSummaryData
{
    public function __construct(
        public int $id,
        public CalculatorType $calculatorType,
        public float $headlineFigure,
        public ?Carbon $createdAt,
        public string $wrapper,
        public int $years,
    ) {}

    public static function fromModel(Scenario $scenario): self
    {
        return new self(
            id: $scenario->id,
            calculatorType: $scenario->calculator_type,
            headlineFigure: (float) ($scenario->result_payload['finalNetReal'] ?? 0.0),
            createdAt: $scenario->created_at,
            wrapper: (string) ($scenario->input_payload['wrapper'] ?? ''),
            years: (int) ($scenario->input_payload['years'] ?? 0),
        );
    }

    /**
     * @return array{id: int, calculatorType: string, headlineFigure: float, createdAt: string|null, wrapper: string, years: int}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'calculatorType' => $this->calculatorType->value,
            'headlineFigure' => $this->headlineFigure,
            'createdAt' => $this->createdAt?->toISOString(),
            'wrapper' => $this->wrapper,
            'years' => $this->years,
        ];
    }
}
