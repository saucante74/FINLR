<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\AnalogyDeltaData;
use App\Modules\SimulationEngine\DTOs\AnalogyResultData;
use App\Modules\SimulationEngine\Enums\AnalogyLeader;
use PHPUnit\Framework\TestCase;

class AnalogyResultDataTest extends TestCase
{
    public function test_has_crossover_is_false_when_crossover_years_is_empty(): void
    {
        $result = $this->makeResult([]);

        $this->assertFalse($result->hasCrossover());
    }

    public function test_has_crossover_is_true_when_crossover_years_is_not_empty(): void
    {
        $result = $this->makeResult([14]);

        $this->assertTrue($result->hasCrossover());
        $this->assertSame([14], $result->crossoverYears);
    }

    /**
     * @param  list<int>  $crossoverYears
     */
    private function makeResult(array $crossoverYears): AnalogyResultData
    {
        $zeroDelta = new AnalogyDeltaData(valueA: 0.0, valueB: 0.0, absolute: 0.0, percent: null);

        return new AnalogyResultData(
            labelA: 'Scénario A',
            labelB: 'Scénario B',
            realNetBalanceWithInflation: $zeroDelta,
            netBalance: $zeroDelta,
            totalGains: $zeroDelta,
            taxesAmount: $zeroDelta,
            totalFees: $zeroDelta,
            totalDeposited: $zeroDelta,
            yearlyBreakdown: [],
            finalLeader: AnalogyLeader::Tie,
            crossoverYears: $crossoverYears,
        );
    }
}
