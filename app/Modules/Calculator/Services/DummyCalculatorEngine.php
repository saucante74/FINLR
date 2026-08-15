<?php

namespace App\Modules\Calculator\Services;

use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\DTOs\CalculationInputData;
use App\Modules\Calculator\DTOs\CalculationResultData;
use App\Modules\Calculator\DTOs\CompoundPointData;
use App\Modules\Calculator\DTOs\FreeCalculationInput;
use App\Modules\Calculator\DTOs\FreeCalculationResult;

/**
 * Public fallback engine used when the private saucante74\CalculatorEngine
 * package is not installed. Computes a plain gross compound growth,
 * without applying any wrapper/fund fee or capital gains tax rule.
 */
class DummyCalculatorEngine implements CalculatorEngineInterface
{
    public function calculate(CalculationInputData $input): CalculationResultData
    {
        $months = max(0, $input->years) * 12;
        $monthlyRate = $input->annualRate / 100 / 12;

        $capital = $input->initialCapital;
        $contributions = $input->initialCapital;

        $points = [$this->buildPoint(0, $contributions, $capital, $input)];

        for ($month = 1; $month <= $months; $month++) {
            $capital = $capital * (1 + $monthlyRate) + $input->monthlyContribution;
            $contributions += $input->monthlyContribution;

            if ($month % 12 === 0) {
                $points[] = $this->buildPoint((int) ($month / 12), $contributions, $capital, $input);
            }
        }

        $last = $points[count($points) - 1];
        $grossGains = $last->gross - $last->contributions;

        return new CalculationResultData(
            points: $points,
            invested: $last->contributions,
            grossGains: $grossGains,
            finalGross: $last->gross,
            netRealGains: $grossGains,
            finalNetReal: $last->gross,
            finalNetRealAdjusted: $last->netRealAdjusted,
            shortfall: 0.0,
        );
    }

    private function buildPoint(int $year, float $contributions, float $capital, CalculationInputData $input): CompoundPointData
    {
        $inflationFactor = $input->inflationEnabled
            ? (1 + $input->inflationRate / 100) ** $year
            : 1.0;

        $netRealAdjusted = $inflationFactor > 0 ? $capital / $inflationFactor : $capital;

        return new CompoundPointData(
            year: $year,
            contributions: $contributions,
            gross: $capital,
            netReal: $capital,
            netRealAdjusted: $netRealAdjusted,
        );
    }

    /**
     * Simulated result for the free calculator fallback: plain gross compound
     * growth, without applying any wrapper/fund fee or capital gains tax rule.
     */
    public function calculateFree(FreeCalculationInput $input): FreeCalculationResult
    {
        $months = max(0, $input->years) * 12;
        $monthlyRate = $input->annualRate / 100 / 12;

        $capital = $input->initialCapital;
        $contributions = $input->initialCapital;

        $points = [$this->buildFreePoint(0, $contributions, $capital, $input)];

        for ($month = 1; $month <= $months; $month++) {
            $capital = $capital * (1 + $monthlyRate) + $input->monthlyContribution;
            $contributions += $input->monthlyContribution;

            if ($month % 12 === 0) {
                $points[] = $this->buildFreePoint((int) ($month / 12), $contributions, $capital, $input);
            }
        }

        $last = $points[count($points) - 1];
        $grossGains = $last->gross - $last->contributions;

        return new FreeCalculationResult(
            points: $points,
            invested: $last->contributions,
            grossGains: $grossGains,
            finalGross: $last->gross,
            netRealGains: $grossGains,
            finalNetReal: $last->gross,
            finalNetRealAdjusted: $last->netRealAdjusted,
            shortfall: 0.0,
        );
    }

    private function buildFreePoint(int $year, float $contributions, float $capital, FreeCalculationInput $input): CompoundPointData
    {
        $inflationFactor = $input->inflationEnabled
            ? (1 + $input->inflationRate / 100) ** $year
            : 1.0;

        $netRealAdjusted = $inflationFactor > 0 ? $capital / $inflationFactor : $capital;

        return new CompoundPointData(
            year: $year,
            contributions: $contributions,
            gross: $capital,
            netReal: $capital,
            netRealAdjusted: $netRealAdjusted,
        );
    }
}
