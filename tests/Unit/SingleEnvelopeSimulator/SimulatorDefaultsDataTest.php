<?php

namespace Tests\Unit\SingleEnvelopeSimulator;

use App\Modules\SingleEnvelopeSimulator\DTOs\SimulatorDefaultsData;
use PHPUnit\Framework\TestCase;

class SimulatorDefaultsDataTest extends TestCase
{
    public function test_default_returns_the_expected_values(): void
    {
        $defaults = SimulatorDefaultsData::default();

        $this->assertSame(10000.0, $defaults->initialCapital);
        $this->assertSame(300.0, $defaults->monthlyContribution);
        $this->assertSame(6.0, $defaults->annualRate);
        $this->assertSame(15, $defaults->years);
        $this->assertSame(0.5, $defaults->wrapperFee);
        $this->assertSame(0.3, $defaults->fundFee);
        $this->assertSame(30.0, $defaults->taxRate);
        $this->assertSame(2.0, $defaults->inflationRate);
        $this->assertFalse($defaults->inflationEnabled);
    }

    public function test_to_array_produces_the_expected_keys_and_values(): void
    {
        $defaults = SimulatorDefaultsData::default();

        $this->assertSame([
            'initialCapital' => 10000.0,
            'monthlyContribution' => 300.0,
            'annualRate' => 6.0,
            'years' => 15,
            'wrapperFee' => 0.5,
            'fundFee' => 0.3,
            'taxRate' => 30.0,
            'inflationRate' => 2.0,
            'inflationEnabled' => false,
        ], $defaults->toArray());
    }
}
