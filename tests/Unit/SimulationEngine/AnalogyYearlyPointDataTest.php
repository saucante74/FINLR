<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\AnalogyDeltaData;
use App\Modules\SimulationEngine\DTOs\AnalogyYearlyPointData;
use App\Modules\SimulationEngine\DTOs\CeilingEventData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Enums\AnalogyLeader;
use PHPUnit\Framework\TestCase;

class AnalogyYearlyPointDataTest extends TestCase
{
    public function test_has_ceiling_event_is_false_when_both_lists_are_empty(): void
    {
        $point = $this->makePoint([], []);

        $this->assertFalse($point->hasCeilingEvent());
    }

    public function test_has_ceiling_event_is_true_when_scenario_a_saturated(): void
    {
        $event = new CeilingEventData(
            accountType: AccountType::Pea,
            reachedAtMonth: 156,
            ceiling: 150_000.0,
            year: 13,
            isReachedOnInitialDeposit: false,
        );

        $point = $this->makePoint([$event], []);

        $this->assertTrue($point->hasCeilingEvent());
    }

    public function test_has_ceiling_event_is_true_when_scenario_b_saturated(): void
    {
        $event = new CeilingEventData(
            accountType: AccountType::Cto,
            reachedAtMonth: 60,
            ceiling: null,
            year: 5,
            isReachedOnInitialDeposit: false,
        );

        $point = $this->makePoint([], [$event]);

        $this->assertTrue($point->hasCeilingEvent());
    }

    /**
     * @param  CeilingEventData[]  $ceilingEventsA
     * @param  CeilingEventData[]  $ceilingEventsB
     */
    private function makePoint(array $ceilingEventsA, array $ceilingEventsB): AnalogyYearlyPointData
    {
        $zeroDelta = new AnalogyDeltaData(valueA: 0.0, valueB: 0.0, absolute: 0.0, percent: null);

        return new AnalogyYearlyPointData(
            year: 5,
            netBalance: $zeroDelta,
            realNetBalanceWithInflation: $zeroDelta,
            totalDeposited: $zeroDelta,
            leader: AnalogyLeader::Tie,
            ceilingEventsA: $ceilingEventsA,
            ceilingEventsB: $ceilingEventsB,
        );
    }
}
