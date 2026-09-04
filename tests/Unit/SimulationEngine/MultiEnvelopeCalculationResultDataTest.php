<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationResultData;
use App\Modules\SimulationEngine\DTOs\PocketResultData;
use App\Modules\SimulationEngine\DTOs\YearlyResultData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Enums\TaxRegime;
use PHPUnit\Framework\TestCase;

class MultiEnvelopeCalculationResultDataTest extends TestCase
{
    public function test_total_fees_amount_sums_the_five_total_fee_categories(): void
    {
        $result = new MultiEnvelopeCalculationResultData(
            summary: $this->makeYear(1),
            yearlyBreakdown: [$this->makeYear(1)],
            pockets: [$this->makePocket()],
            totalBrokerageFeesAmount: 1.0,
            totalManagementFeesAmount: 2.0,
            totalTerImpactAmount: 3.0,
            totalCustodyFeesAmount: 4.0,
            totalArbitrageFeesAmount: 5.0,
        );

        $this->assertSame(15.0, $result->totalFeesAmount());
    }

    public function test_first_pocket_returns_the_first_element_of_pockets(): void
    {
        $first = $this->makePocket();
        $second = $this->makePocket();

        $result = new MultiEnvelopeCalculationResultData(
            summary: $this->makeYear(1),
            yearlyBreakdown: [$this->makeYear(1)],
            pockets: [$first, $second],
        );

        $this->assertSame($first, $result->firstPocket());
    }

    private function makeYear(int $year): YearlyResultData
    {
        return new YearlyResultData(
            year: $year,
            totalDeposited: 0.0,
            grossBalance: 0.0,
            totalGains: 0.0,
            taxesAmount: 0.0,
            netBalance: 0.0,
            realNetBalanceWithInflation: 0.0,
        );
    }

    private function makePocket(): PocketResultData
    {
        return new PocketResultData(
            accountType: AccountType::Pea,
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
            taxRegime: TaxRegime::SocialLeviesOnly,
            netBalance: 0.0,
        );
    }
}
