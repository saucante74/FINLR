<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\EnvelopeConfigData;
use App\Modules\SimulationEngine\DTOs\FiscalProfileData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\Enums\AccountType;
use PHPUnit\Framework\TestCase;

class MultiEnvelopeCalculationInputDataTest extends TestCase
{
    public function test_constructor_stores_the_envelopes_overflow_target_and_fiscal_profile(): void
    {
        $envelope = $this->makeEnvelope();
        $fiscalProfile = new FiscalProfileData(marginalIncomeTaxRate: 0.11);

        $input = new MultiEnvelopeCalculationInputData(
            envelopes: [$envelope],
            defaultOverflowAccountType: null,
            fiscalProfile: $fiscalProfile,
        );

        $this->assertSame([$envelope], $input->envelopes);
        $this->assertNull($input->defaultOverflowAccountType);
        $this->assertSame($fiscalProfile, $input->fiscalProfile);
    }

    public function test_default_overflow_account_type_is_compte_courant_and_fiscal_profile_is_common_law(): void
    {
        $input = new MultiEnvelopeCalculationInputData(envelopes: [$this->makeEnvelope()]);

        $this->assertSame(AccountType::CompteCourant, $input->defaultOverflowAccountType);
        $this->assertEquals(new FiscalProfileData, $input->fiscalProfile);
    }

    private function makeEnvelope(): EnvelopeConfigData
    {
        return new EnvelopeConfigData(
            accountType: AccountType::Pea,
            initialAmount: 0.0,
            monthlyContribution: 100.0,
            durationYears: 10,
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
