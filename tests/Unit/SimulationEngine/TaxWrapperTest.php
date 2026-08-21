<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Enums\TaxWrapper;
use PHPUnit\Framework\TestCase;
use ValueError;

class TaxWrapperTest extends TestCase
{
    public function test_it_only_exposes_pea_and_cto(): void
    {
        $this->assertSame(['pea', 'cto'], array_column(TaxWrapper::cases(), 'value'));
    }

    public function test_constructing_it_from_av_throws_a_value_error(): void
    {
        $this->expectException(ValueError::class);

        TaxWrapper::from('av');
    }
}
