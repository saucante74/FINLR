<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\YearlyResultData;
use PHPUnit\Framework\TestCase;

class YearlyResultDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $year = new YearlyResultData(
            year: 5,
            totalDeposited: 6000.0,
            grossBalance: 6500.0,
            totalGains: 500.0,
            taxesAmount: 93.0,
            netBalance: 6407.0,
            realNetBalanceWithInflation: 6200.0,
        );

        $this->assertSame(5, $year->year);
        $this->assertSame(6000.0, $year->totalDeposited);
        $this->assertSame(6500.0, $year->grossBalance);
        $this->assertSame(500.0, $year->totalGains);
        $this->assertSame(93.0, $year->taxesAmount);
        $this->assertSame(6407.0, $year->netBalance);
        $this->assertSame(6200.0, $year->realNetBalanceWithInflation);
    }
}
