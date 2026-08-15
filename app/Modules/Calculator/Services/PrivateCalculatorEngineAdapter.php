<?php

namespace App\Modules\Calculator\Services;

use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\DTOs\CalculationInputData;
use App\Modules\Calculator\DTOs\CalculationResultData;
use App\Modules\Calculator\DTOs\CompoundPointData;
use saucante74\CalculatorEngine\CalculatorEngine;
use saucante74\CalculatorEngine\DTOs\CalculationInput as PackageCalculationInput;
use saucante74\CalculatorEngine\DTOs\CalculationResult as PackageCalculationResult;

/**
 * Adapter around the private saucante74\CalculatorEngine package: translates
 * this module's DTOs to/from the private package's own DTOs so the rest
 * of the application never depends on the private package directly.
 *
 * This class is excluded from PHPStan analysis (see phpstan.neon) because
 * the private package is not installed in every environment.
 */
class PrivateCalculatorEngineAdapter implements CalculatorEngineInterface
{
    public function __construct(private readonly CalculatorEngine $engine) {}

    public function calculate(CalculationInputData $input): CalculationResultData
    {
        $result = $this->engine->calculate($this->toPackageInput($input));

        return $this->toCalculationResultData($result);
    }

    private function toPackageInput(CalculationInputData $input): PackageCalculationInput
    {
        return new PackageCalculationInput(
            initialCapital: $input->initialCapital,
            monthlyContribution: $input->monthlyContribution,
            annualRate: $input->annualRate,
            years: $input->years,
            wrapperFee: $input->wrapperFee,
            fundFee: $input->fundFee,
            taxRate: $input->taxRate,
            inflationRate: $input->inflationRate,
            inflationEnabled: $input->inflationEnabled,
        );
    }

    private function toCalculationResultData(PackageCalculationResult $result): CalculationResultData
    {
        return new CalculationResultData(
            points: array_map(
                static fn ($point) => new CompoundPointData(
                    year: $point->year,
                    contributions: $point->contributions,
                    gross: $point->gross,
                    netReal: $point->netReal,
                    netRealAdjusted: $point->netRealAdjusted,
                ),
                $result->points,
            ),
            invested: $result->invested,
            grossGains: $result->grossGains,
            finalGross: $result->finalGross,
            netRealGains: $result->netRealGains,
            finalNetReal: $result->finalNetReal,
            finalNetRealAdjusted: $result->finalNetRealAdjusted,
            shortfall: $result->shortfall,
        );
    }
}
