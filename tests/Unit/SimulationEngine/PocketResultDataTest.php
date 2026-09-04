<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\PocketResultData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Enums\TaxRegime;
use PHPUnit\Framework\TestCase;

class PocketResultDataTest extends TestCase
{
    public function test_constructor_stores_every_field_as_given(): void
    {
        $pocket = new PocketResultData(
            accountType: AccountType::Pea,
            initialDeposit: 1000.0,
            dcaDeposited: 2000.0,
            totalDeposited: 3000.0,
            dcaMonthsCount: 20,
            lastDcaAmount: 100.0,
            firstResidualDcaAmount: 0.0,
            ceilingReachedMonth: null,
            grossBalance: 3500.0,
            totalGains: 500.0,
            taxesAmount: 93.0,
            incomeTaxAmount: 0.0,
            socialLeviesAmount: 93.0,
            taxRegime: TaxRegime::SocialLeviesOnly,
            netBalance: 3407.0,
            brokerageFeesAmount: 3.0,
            managementFeesAmount: 2.0,
            terImpactAmount: 1.0,
            custodyFeesAmount: 0.5,
            arbitrageFeesAmount: 0.5,
        );

        $this->assertSame(AccountType::Pea, $pocket->accountType);
        $this->assertSame(1000.0, $pocket->initialDeposit);
        $this->assertSame(2000.0, $pocket->dcaDeposited);
        $this->assertSame(3000.0, $pocket->totalDeposited);
        $this->assertSame(20, $pocket->dcaMonthsCount);
        $this->assertSame(100.0, $pocket->lastDcaAmount);
        $this->assertSame(0.0, $pocket->firstResidualDcaAmount);
        $this->assertNull($pocket->ceilingReachedMonth);
        $this->assertSame(3500.0, $pocket->grossBalance);
        $this->assertSame(500.0, $pocket->totalGains);
        $this->assertSame(93.0, $pocket->taxesAmount);
        $this->assertSame(0.0, $pocket->incomeTaxAmount);
        $this->assertSame(93.0, $pocket->socialLeviesAmount);
        $this->assertSame(TaxRegime::SocialLeviesOnly, $pocket->taxRegime);
        $this->assertSame(3407.0, $pocket->netBalance);
    }

    public function test_total_fees_amount_sums_the_five_fee_categories(): void
    {
        $pocket = new PocketResultData(
            accountType: AccountType::Cto,
            initialDeposit: 0.0,
            dcaDeposited: 0.0,
            totalDeposited: 0.0,
            dcaMonthsCount: 0,
            lastDcaAmount: 0.0,
            firstResidualDcaAmount: 0.0,
            ceilingReachedMonth: null,
            grossBalance: 0.0,
            totalGains: 0.0,
            taxesAmount: 0.0,
            incomeTaxAmount: 0.0,
            socialLeviesAmount: 0.0,
            taxRegime: TaxRegime::FlatTax,
            netBalance: 0.0,
            brokerageFeesAmount: 1.0,
            managementFeesAmount: 2.0,
            terImpactAmount: 3.0,
            custodyFeesAmount: 4.0,
            arbitrageFeesAmount: 5.0,
        );

        $this->assertSame(15.0, $pocket->totalFeesAmount());
    }
}
