<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\CeilingEventData;
use App\Modules\SimulationEngine\Enums\AccountType;
use PHPUnit\Framework\TestCase;

class CeilingEventDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $event = new CeilingEventData(
            accountType: AccountType::Pea,
            reachedAtMonth: 156,
            ceiling: 150_000.0,
            year: 13,
            isReachedOnInitialDeposit: false,
        );

        $this->assertSame(AccountType::Pea, $event->accountType);
        $this->assertSame(156, $event->reachedAtMonth);
        $this->assertSame(150_000.0, $event->ceiling);
        $this->assertSame(13, $event->year);
        $this->assertFalse($event->isReachedOnInitialDeposit);
    }

    public function test_reached_on_initial_deposit_at_month_zero(): void
    {
        $event = new CeilingEventData(
            accountType: AccountType::LivretA,
            reachedAtMonth: 0,
            ceiling: 22_950.0,
            year: 1,
            isReachedOnInitialDeposit: true,
        );

        $this->assertSame(0, $event->reachedAtMonth);
        $this->assertSame(1, $event->year);
        $this->assertTrue($event->isReachedOnInitialDeposit);
    }
}
