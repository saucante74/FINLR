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
    ) {}

    public static function fromModel(Scenario $scenario): self
    {
        return new self(
            id: $scenario->id,
            calculatorType: $scenario->calculator_type,
            headlineFigure: (float) ($scenario->result_payload['finalNetReal'] ?? 0.0),
            // Kept as the Carbon instance Eloquent already casts created_at
            // to (nullable, like the column itself), rather than converting
            // to CarbonImmutable: it matches what the rest of the codebase
            // already does when reading this same column — see
            // ShowScenarioController's own `$scenario->created_at?->toISOString()`.
            createdAt: $scenario->created_at,
        );
    }

    /**
     * @return array{id: int, calculatorType: string, headlineFigure: float, createdAt: string|null}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'calculatorType' => $this->calculatorType->value,
            'headlineFigure' => $this->headlineFigure,
            'createdAt' => $this->createdAt?->toISOString(),
        ];
    }
}
