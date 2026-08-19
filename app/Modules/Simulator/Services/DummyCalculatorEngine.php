<?php

namespace App\Modules\Simulator\Services;

use App\Modules\Simulator\Contracts\SimulationEngineInterface;
use App\Modules\Simulator\DTOs\CalculationInputData;
use App\Modules\Simulator\DTOs\CalculationResultData;
use App\Modules\Simulator\DTOs\CompoundPointData;

/**
 * Public fallback engine used when the private saucante74\CalculatorEngine
 * package is not installed. Computes a plain gross compound growth,
 * without applying any wrapper/fund fee or capital gains tax rule.
 */
class DummyCalculatorEngine implements SimulationEngineInterface
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
}
