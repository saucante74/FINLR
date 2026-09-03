<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\AnalogyComparisonInputData;
use App\Modules\SimulationEngine\DTOs\FiscalProfileData;
use App\Modules\SimulationEngine\Enums\AccountType;
use PHPUnit\Framework\TestCase;

class AnalogyComparisonInputDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $fiscalProfile = new FiscalProfileData(marginalIncomeTaxRate: 0.11);

        $input = new AnalogyComparisonInputData(
            accountTypeA: AccountType::Pea,
            accountTypeB: AccountType::Cto,
            initialAmount: 0.0,
            monthlyContribution: 1000.0,
            durationYears: 20,
            annualReturnRate: 0.06,
            terRate: 0.0,
            brokerageFeeRate: 0.0,
            managementFeeRate: 0.0,
            custodyFeeRate: 0.0,
            custodyFeeFixedMonthly: 0.0,
            arbitrageFeeRate: 0.0,
            arbitrageFeeFixed: 0.0,
            inflationRate: 0.02,
            labelA: 'PEA plafonné',
            labelB: 'CTO sans plafond',
            fiscalProfile: $fiscalProfile,
        );

        $this->assertSame(AccountType::Pea, $input->accountTypeA);
        $this->assertSame(AccountType::Cto, $input->accountTypeB);
        $this->assertSame(1000.0, $input->monthlyContribution);
        $this->assertSame(20, $input->durationYears);
        $this->assertSame(0.06, $input->annualReturnRate);
        $this->assertSame(0.02, $input->inflationRate);
        $this->assertSame('PEA plafonné', $input->labelA);
        $this->assertSame('CTO sans plafond', $input->labelB);
        $this->assertSame($fiscalProfile, $input->fiscalProfile);
    }

    public function test_labels_and_fiscal_profile_default_to_the_packages_own_defaults(): void
    {
        $input = new AnalogyComparisonInputData(
            accountTypeA: AccountType::Pea,
            accountTypeB: AccountType::Cto,
            initialAmount: 0.0,
            monthlyContribution: 1000.0,
            durationYears: 20,
            annualReturnRate: 0.06,
            terRate: 0.0,
            brokerageFeeRate: 0.0,
            managementFeeRate: 0.0,
            custodyFeeRate: 0.0,
            custodyFeeFixedMonthly: 0.0,
            arbitrageFeeRate: 0.0,
            arbitrageFeeFixed: 0.0,
            inflationRate: 0.02,
        );

        $this->assertSame('Scénario A', $input->labelA);
        $this->assertSame('Scénario B', $input->labelB);
        $this->assertEquals(new FiscalProfileData, $input->fiscalProfile);
    }
}
