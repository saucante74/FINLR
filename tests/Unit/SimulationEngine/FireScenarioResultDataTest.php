<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\FireScenarioResultData;
use PHPUnit\Framework\TestCase;

class FireScenarioResultDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $scenario = new FireScenarioResultData(
            requiredCapital: 500_000.0,
            retirementAge: 55.5,
            yearsToRetirement: 25.5,
        );

        $this->assertSame(500_000.0, $scenario->requiredCapital);
        $this->assertSame(55.5, $scenario->retirementAge);
        $this->assertSame(25.5, $scenario->yearsToRetirement);
    }

    public function test_retirement_age_and_years_to_retirement_can_both_be_null(): void
    {
        $scenario = new FireScenarioResultData(
            requiredCapital: 500_000.0,
            retirementAge: null,
            yearsToRetirement: null,
        );

        $this->assertNull($scenario->retirementAge);
        $this->assertNull($scenario->yearsToRetirement);
    }
}
