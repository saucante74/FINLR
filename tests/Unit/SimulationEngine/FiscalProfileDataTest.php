<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\FiscalProfileData;
use App\Modules\SimulationEngine\Enums\TaxRegime;
use PHPUnit\Framework\TestCase;

class FiscalProfileDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $profile = new FiscalProfileData(
            marginalIncomeTaxRate: 0.30,
            forcedRegime: TaxRegime::ProgressiveScale,
            isCoupleHousehold: true,
            socialLeviesStandard: 0.186,
            socialLeviesReduced: 0.172,
            flatTaxIncomeRate: 0.128,
            lifeInsuranceReducedRate: 0.075,
            lifeInsurancePremiumThreshold: 150_000.0,
        );

        $this->assertSame(0.30, $profile->marginalIncomeTaxRate);
        $this->assertSame(TaxRegime::ProgressiveScale, $profile->forcedRegime);
        $this->assertTrue($profile->isCoupleHousehold);
        $this->assertSame(0.186, $profile->socialLeviesStandard);
        $this->assertSame(0.172, $profile->socialLeviesReduced);
        $this->assertSame(0.128, $profile->flatTaxIncomeRate);
        $this->assertSame(0.075, $profile->lifeInsuranceReducedRate);
        $this->assertSame(150_000.0, $profile->lifeInsurancePremiumThreshold);
    }

    public function test_every_field_defaults_to_null_or_common_law_so_the_package_falls_back_to_its_own_rates(): void
    {
        $profile = new FiscalProfileData;

        $this->assertNull($profile->marginalIncomeTaxRate);
        $this->assertNull($profile->forcedRegime);
        $this->assertFalse($profile->isCoupleHousehold);
        $this->assertNull($profile->socialLeviesStandard);
        $this->assertNull($profile->socialLeviesReduced);
        $this->assertNull($profile->flatTaxIncomeRate);
        $this->assertNull($profile->lifeInsuranceReducedRate);
        $this->assertNull($profile->lifeInsurancePremiumThreshold);
    }
}
