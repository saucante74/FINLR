<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\CalculationResultData;
use App\Modules\SimulationEngine\DTOs\CompoundPointData;
use PHPUnit\Framework\TestCase;

class CalculationResultDataTest extends TestCase
{
    public function test_to_array_serializes_points_through_their_own_to_array(): void
    {
        $result = new CalculationResultData(
            points: [
                new CompoundPointData(
                    year: 1,
                    contributions: 1200.0,
                    gross: 1250.0,
                    netReal: 1230.0,
                    netRealAdjusted: 1210.0,
                ),
                new CompoundPointData(
                    year: 2,
                    contributions: 2400.0,
                    gross: 2550.0,
                    netReal: 2500.0,
                    netRealAdjusted: 2450.0,
                ),
            ],
            invested: 2400.0,
            grossGains: 150.0,
            finalGross: 2550.0,
            netRealGains: 100.0,
            finalNetReal: 2500.0,
            finalNetRealAdjusted: 2450.0,
            shortfall: 0.0,
        );

        $this->assertSame([
            'points' => [
                [
                    'year' => 1,
                    'contributions' => 1200.0,
                    'gross' => 1250.0,
                    'netReal' => 1230.0,
                    'netRealAdjusted' => 1210.0,
                ],
                [
                    'year' => 2,
                    'contributions' => 2400.0,
                    'gross' => 2550.0,
                    'netReal' => 2500.0,
                    'netRealAdjusted' => 2450.0,
                ],
            ],
            'invested' => 2400.0,
            'grossGains' => 150.0,
            'finalGross' => 2550.0,
            'netRealGains' => 100.0,
            'finalNetReal' => 2500.0,
            'finalNetRealAdjusted' => 2450.0,
            'shortfall' => 0.0,
        ], $result->toArray());
    }

    public function test_to_array_serializes_an_empty_points_list(): void
    {
        $result = new CalculationResultData(
            points: [],
            invested: 1000.0,
            grossGains: 0.0,
            finalGross: 1000.0,
            netRealGains: 0.0,
            finalNetReal: 1000.0,
            finalNetRealAdjusted: 1000.0,
            shortfall: 0.0,
        );

        $this->assertSame([], $result->toArray()['points']);
    }
}
