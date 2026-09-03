<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\AnalogyComparisonInputData;
use App\Modules\SimulationEngine\DTOs\FiscalProfileData;
use App\Modules\SimulationEngine\Enums\AccountType;
use ArgumentCountError;
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

    public function test_fiscal_profile_defaults_to_common_law_when_omitted(): void
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
            labelA: 'Scénario A',
            labelB: 'Scénario B',
        );

        $this->assertEquals(new FiscalProfileData, $input->fiscalProfile);
    }

    /**
     * A DTO must never carry user-facing text: labelA/labelB have no
     * hardcoded default (see the class docblock), so omitting them is a
     * caller error, not a silent fallback to French copy.
     */
    public function test_omitting_labels_raises_an_error_instead_of_silently_defaulting(): void
    {
        $this->expectException(ArgumentCountError::class);

        new AnalogyComparisonInputData(
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
    }
}
