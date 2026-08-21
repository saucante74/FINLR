<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\CompoundPointData;
use PHPUnit\Framework\TestCase;

class CompoundPointDataTest extends TestCase
{
    public function test_to_array_produces_the_expected_keys_and_values(): void
    {
        $point = new CompoundPointData(
            year: 3,
            contributions: 3600.0,
            gross: 4123.45,
            netReal: 4000.12,
            netRealAdjusted: 3900.0,
        );

        $this->assertSame([
            'year' => 3,
            'contributions' => 3600.0,
            'gross' => 4123.45,
            'netReal' => 4000.12,
            'netRealAdjusted' => 3900.0,
        ], $point->toArray());
    }
}
