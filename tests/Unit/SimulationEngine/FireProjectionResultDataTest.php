<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\FireProjectionResultData;
use App\Modules\SimulationEngine\DTOs\FireScenarioResultData;
use PHPUnit\Framework\TestCase;

class FireProjectionResultDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $optimistic = new FireScenarioResultData(requiredCapital: 400_000.0, retirementAge: 50.0, yearsToRetirement: 20.0);
        $neutral = new FireScenarioResultData(requiredCapital: 500_000.0, retirementAge: 55.0, yearsToRetirement: 25.0);
        $pessimistic = new FireScenarioResultData(requiredCapital: 650_000.0, retirementAge: 60.0, yearsToRetirement: 30.0);

        $result = new FireProjectionResultData(
            requiredCapital: 500_000.0,
            retirementAge: 55.0,
            yearsToRetirement: 25.0,
            optimistic: $optimistic,
            neutral: $neutral,
            pessimistic: $pessimistic,
        );

        $this->assertSame(500_000.0, $result->requiredCapital);
        $this->assertSame(55.0, $result->retirementAge);
        $this->assertSame(25.0, $result->yearsToRetirement);
        $this->assertSame($optimistic, $result->optimistic);
        $this->assertSame($neutral, $result->neutral);
        $this->assertSame($pessimistic, $result->pessimistic);
    }
}
