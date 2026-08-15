<?php

namespace App\Modules\Calculator\Services;

use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\DTOs\CalculationInputData;
use App\Modules\Calculator\DTOs\CalculationResultData;
use App\Modules\Calculator\DTOs\CompoundPointData;
use App\Modules\Calculator\DTOs\FreeCalculationInput;
use App\Modules\Calculator\DTOs\FreeCalculationResult;
use App\Modules\Calculator\Enums\TaxWrapper;
use saucante74\CalculatorEngine\CalculatorEngine;
use saucante74\CalculatorEngine\DTOs\CalculationInput as PackageCalculationInput;
use saucante74\CalculatorEngine\DTOs\CalculationResult as PackageCalculationResult;
use saucante74\CalculatorEngine\DTOs\FreeCalculationInput as PackageFreeCalculationInput;
use saucante74\CalculatorEngine\DTOs\FreeCalculationResult as PackageFreeCalculationResult;
use saucante74\CalculatorEngine\DTOs\FreeYearlyPoint as PackageFreeYearlyPoint;
use saucante74\CalculatorEngine\DTOs\YearlyResult as PackageYearlyResult;
use saucante74\CalculatorEngine\Enums\AccountType as PackageAccountType;

/**
 * Adapter around the private saucante74\CalculatorEngine package: translates
 * this module's DTOs to/from the private package's own DTOs so the rest
 * of the application never depends on the private package directly.
 *
 * The private engine only models two fiscal regimes (PEA/CTO) and computes
 * their tax internally, so wrapperFee/fundFee/taxRate have no equivalent on
 * the package side and are not forwarded; TaxWrapper::Av is treated as CTO
 * since it has no preferential/ceiling rule of its own.
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

        return $this->toCalculationResultData($input, $result);
    }

    public function calculateFree(FreeCalculationInput $input): FreeCalculationResult
    {
        $result = $this->engine->calculateFree($this->toPackageFreeInput($input));

        return $this->toFreeCalculationResult($result);
    }

    private function toPackageInput(CalculationInputData $input): PackageCalculationInput
    {
        return new PackageCalculationInput(
            initialAmount: $input->initialCapital,
            monthlyContribution: $input->monthlyContribution,
            durationYears: $input->years,
            annualReturnRate: $input->annualRate / 100,
            inflationRate: $input->inflationEnabled ? $input->inflationRate / 100 : 0.0,
            accountType: $this->toPackageAccountType($input->wrapper),
        );
    }

    private function toPackageAccountType(TaxWrapper $wrapper): PackageAccountType
    {
        return match ($wrapper) {
            TaxWrapper::Pea => PackageAccountType::PEA,
            TaxWrapper::Cto, TaxWrapper::Av => PackageAccountType::CTO,
        };
    }

    private function toCalculationResultData(CalculationInputData $input, PackageCalculationResult $result): CalculationResultData
    {
        $points = [$this->buildInitialPoint($input)];

        foreach ($result->yearlyBreakdown as $yearlyResult) {
            $points[] = $this->toCompoundPointData($yearlyResult);
        }

        $summary = $result->summary;

        return new CalculationResultData(
            points: $points,
            invested: $summary->totalDeposited,
            grossGains: $summary->totalGains,
            finalGross: $summary->grossBalance,
            netRealGains: $summary->netBalance - $summary->totalDeposited,
            finalNetReal: $summary->netBalance,
            finalNetRealAdjusted: $summary->realNetBalanceWithInflation,
            shortfall: 0.0,
        );
    }

    private function buildInitialPoint(CalculationInputData $input): CompoundPointData
    {
        return new CompoundPointData(
            year: 0,
            contributions: $input->initialCapital,
            gross: $input->initialCapital,
            netReal: $input->initialCapital,
            netRealAdjusted: $input->initialCapital,
        );
    }

    private function toCompoundPointData(PackageYearlyResult $yearlyResult): CompoundPointData
    {
        return new CompoundPointData(
            year: $yearlyResult->year,
            contributions: $yearlyResult->totalDeposited,
            gross: $yearlyResult->grossBalance,
            netReal: $yearlyResult->netBalance,
            netRealAdjusted: $yearlyResult->realNetBalanceWithInflation,
        );
    }

    private function toPackageFreeInput(FreeCalculationInput $input): PackageFreeCalculationInput
    {
        return new PackageFreeCalculationInput(
            initialAmount: $input->initialCapital,
            monthlyContribution: $input->monthlyContribution,
            durationYears: $input->years,
            annualReturnRate: $input->annualRate / 100,
            wrapperFeeRate: $input->wrapperFee / 100,
            fundFeeRate: $input->fundFee / 100,
            taxRate: $input->taxRate / 100,
            inflationRate: $input->inflationEnabled ? $input->inflationRate / 100 : 0.0,
        );
    }

    private function toFreeCalculationResult(PackageFreeCalculationResult $result): FreeCalculationResult
    {
        $points = array_map(
            $this->toFreeCompoundPointData(...),
            $result->yearlyBreakdown,
        );

        return new FreeCalculationResult(
            points: $points,
            invested: $result->invested,
            grossGains: $result->grossGains,
            finalGross: $result->finalGross,
            netRealGains: $result->netRealGains,
            finalNetReal: $result->finalNetReal,
            finalNetRealAdjusted: $result->finalNetRealAdjusted,
            shortfall: $result->shortfall,
        );
    }

    private function toFreeCompoundPointData(PackageFreeYearlyPoint $point): CompoundPointData
    {
        return new CompoundPointData(
            year: $point->year,
            contributions: $point->totalDeposited,
            gross: $point->grossBalance,
            netReal: $point->netRealBalance,
            netRealAdjusted: $point->netRealBalanceAdjusted,
        );
    }
}
