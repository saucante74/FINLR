<?php

namespace App\Modules\FireSimulator\Support;

use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use App\Modules\SimulationEngine\DTOs\FireProjectionResultData;
use App\Modules\SimulationEngine\DTOs\FireScenarioResultData;

/**
 * Converts SimulationEngine's FIRE DTOs to plain arrays for storage in
 * Scenario::$input_payload/$result_payload — same reasoning as
 * AnalogyScenarioPayload/MultiEnvelopeScenarioPayload: SimulationEngine's
 * DTOs are reused as-is, not modified, so no toArray() lives on them.
 * Purely mechanical field-by-field mapping.
 */
final class FireScenarioPayload
{
    /**
     * @return array<string, mixed>
     */
    public static function input(FireProjectionInputData $input): array
    {
        return [
            'currentAge' => $input->currentAge,
            'currentCapital' => $input->currentCapital,
            'monthlyContribution' => $input->monthlyContribution,
            'annualReturnRate' => $input->annualReturnRate,
            'desiredAnnualIncome' => $input->desiredAnnualIncome,
            'withdrawalRate' => $input->withdrawalRate,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function result(FireProjectionResultData $result): array
    {
        return [
            'requiredCapital' => $result->requiredCapital,
            'retirementAge' => $result->retirementAge,
            'yearsToRetirement' => $result->yearsToRetirement,
            'optimistic' => self::scenario($result->optimistic),
            'neutral' => self::scenario($result->neutral),
            'pessimistic' => self::scenario($result->pessimistic),
        ];
    }

    /**
     * @return array{requiredCapital: float, retirementAge: float|null, yearsToRetirement: float|null}
     */
    private static function scenario(FireScenarioResultData $scenario): array
    {
        return [
            'requiredCapital' => $scenario->requiredCapital,
            'retirementAge' => $scenario->retirementAge,
            'yearsToRetirement' => $scenario->yearsToRetirement,
        ];
    }
}
