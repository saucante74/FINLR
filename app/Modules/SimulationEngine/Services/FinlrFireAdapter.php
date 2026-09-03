<?php

namespace App\Modules\SimulationEngine\Services;

use App\Modules\SimulationEngine\Contracts\FireEngineInterface;
use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use App\Modules\SimulationEngine\DTOs\FireProjectionResultData;
use App\Modules\SimulationEngine\DTOs\FireScenarioResultData;
use saucante74\CalculatorEngine\Fire\DTOs\FireProjectionInput as PackageFireProjectionInput;
use saucante74\CalculatorEngine\Fire\DTOs\FireProjectionResult as PackageFireProjectionResult;
use saucante74\CalculatorEngine\Fire\DTOs\FireScenarioResult as PackageFireScenarioResult;
use saucante74\CalculatorEngine\Fire\FireCalculator;

/**
 * Adapter around saucante74\CalculatorEngine\Fire\FireCalculator::project()
 * (docs/API.md §4) — a facade deliberately independent from AccountType,
 * TaxStrategyInterface and FiscalProfile, so unlike the other two
 * adapters this one never touches SimulationEngine\Enums\AccountType or
 * FiscalProfileData.
 */
class FinlrFireAdapter implements FireEngineInterface
{
    public function __construct(private readonly FireCalculator $engine) {}

    public function project(FireProjectionInputData $input): FireProjectionResultData
    {
        $result = $this->engine->project($this->toPackageInput($input));

        return $this->toFireProjectionResultData($result);
    }

    private function toPackageInput(FireProjectionInputData $input): PackageFireProjectionInput
    {
        return new PackageFireProjectionInput(
            currentAge: $input->currentAge,
            currentCapital: $input->currentCapital,
            monthlyContribution: $input->monthlyContribution,
            annualReturnRate: $input->annualReturnRate,
            desiredAnnualIncome: $input->desiredAnnualIncome,
            withdrawalRate: $input->withdrawalRate,
        );
    }

    private function toFireProjectionResultData(PackageFireProjectionResult $result): FireProjectionResultData
    {
        return new FireProjectionResultData(
            requiredCapital: $result->requiredCapital,
            retirementAge: $result->retirementAge,
            yearsToRetirement: $result->yearsToRetirement,
            optimistic: $this->toFireScenarioResultData($result->optimistic),
            neutral: $this->toFireScenarioResultData($result->neutral),
            pessimistic: $this->toFireScenarioResultData($result->pessimistic),
        );
    }

    private function toFireScenarioResultData(PackageFireScenarioResult $scenario): FireScenarioResultData
    {
        return new FireScenarioResultData(
            requiredCapital: $scenario->requiredCapital,
            retirementAge: $scenario->retirementAge,
            yearsToRetirement: $scenario->yearsToRetirement,
        );
    }
}
