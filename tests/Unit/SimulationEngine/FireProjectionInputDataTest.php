<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use PHPUnit\Framework\TestCase;

class FireProjectionInputDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $input = new FireProjectionInputData(
            currentAge: 30,
            currentCapital: 10_000.0,
            monthlyContribution: 200.0,
            annualReturnRate: 0.06,
            desiredAnnualIncome: 20_000.0,
            withdrawalRate: 4.0,
        );

        $this->assertSame(30, $input->currentAge);
        $this->assertSame(10_000.0, $input->currentCapital);
        $this->assertSame(200.0, $input->monthlyContribution);
        $this->assertSame(0.06, $input->annualReturnRate);
        $this->assertSame(20_000.0, $input->desiredAnnualIncome);
        $this->assertSame(4.0, $input->withdrawalRate);
    }
}
