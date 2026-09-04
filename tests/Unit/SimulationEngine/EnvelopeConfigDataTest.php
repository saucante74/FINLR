<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\EnvelopeConfigData;
use App\Modules\SimulationEngine\Enums\AccountType;
use PHPUnit\Framework\TestCase;

class EnvelopeConfigDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $config = new EnvelopeConfigData(
            accountType: AccountType::PeaPme,
            initialAmount: 1000.0,
            monthlyContribution: 200.0,
            durationYears: 10,
            annualReturnRate: 0.06,
            terRate: 0.002,
            brokerageFeeRate: 0.001,
            managementFeeRate: 0.005,
            custodyFeeRate: 0.001,
            custodyFeeFixedMonthly: 2.0,
            arbitrageFeeRate: 0.001,
            arbitrageFeeFixed: 0.0,
            inflationRate: 0.02,
            isUncapped: true,
            customTaxRate: 0.15,
        );

        $this->assertSame(AccountType::PeaPme, $config->accountType);
        $this->assertSame(1000.0, $config->initialAmount);
        $this->assertSame(200.0, $config->monthlyContribution);
        $this->assertSame(10, $config->durationYears);
        $this->assertSame(0.06, $config->annualReturnRate);
        $this->assertSame(0.002, $config->terRate);
        $this->assertSame(0.001, $config->brokerageFeeRate);
        $this->assertSame(0.005, $config->managementFeeRate);
        $this->assertSame(0.001, $config->custodyFeeRate);
        $this->assertSame(2.0, $config->custodyFeeFixedMonthly);
        $this->assertSame(0.001, $config->arbitrageFeeRate);
        $this->assertSame(0.0, $config->arbitrageFeeFixed);
        $this->assertSame(0.02, $config->inflationRate);
        $this->assertTrue($config->isUncapped);
        $this->assertSame(0.15, $config->customTaxRate);
    }

    public function test_is_uncapped_and_custom_tax_rate_default_to_the_common_case(): void
    {
        $config = new EnvelopeConfigData(
            accountType: AccountType::Cto,
            initialAmount: 0.0,
            monthlyContribution: 0.0,
            durationYears: 1,
            annualReturnRate: 0.0,
            terRate: 0.0,
            brokerageFeeRate: 0.0,
            managementFeeRate: 0.0,
            custodyFeeRate: 0.0,
            custodyFeeFixedMonthly: 0.0,
            arbitrageFeeRate: 0.0,
            arbitrageFeeFixed: 0.0,
            inflationRate: 0.0,
        );

        $this->assertFalse($config->isUncapped);
        $this->assertNull($config->customTaxRate);
    }
}
