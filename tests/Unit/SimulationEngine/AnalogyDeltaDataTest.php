<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\AnalogyDeltaData;
use PHPUnit\Framework\TestCase;

class AnalogyDeltaDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $delta = new AnalogyDeltaData(
            valueA: 1000.0,
            valueB: 1200.0,
            absolute: 200.0,
            percent: 0.2,
        );

        $this->assertSame(1000.0, $delta->valueA);
        $this->assertSame(1200.0, $delta->valueB);
        $this->assertSame(200.0, $delta->absolute);
        $this->assertSame(0.2, $delta->percent);
    }

    public function test_percent_can_be_null(): void
    {
        $delta = new AnalogyDeltaData(
            valueA: 0.0,
            valueB: 50.0,
            absolute: 50.0,
            percent: null,
        );

        $this->assertNull($delta->percent);
    }
}
