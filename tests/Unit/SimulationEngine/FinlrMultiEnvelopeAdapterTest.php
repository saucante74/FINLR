<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\DTOs\EnvelopeConfigData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Services\FinlrMultiEnvelopeAdapter;
use PHPUnit\Framework\TestCase;
use saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\Actions\MultiEnvelopeSimulator;

class FinlrMultiEnvelopeAdapterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    public function test_it_maps_a_single_envelope_cascade_end_to_end(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate(new MultiEnvelopeCalculationInputData(
            envelopes: [$this->makeEnvelope(accountType: AccountType::Pea, durationYears: 5)],
            defaultOverflowAccountType: null,
        ));

        $this->assertCount(1, $result->pockets);
        $this->assertSame(AccountType::Pea, $result->firstPocket()->accountType);
        $this->assertSame(5, $result->summary->year);
        $this->assertSame(0.0, $result->totalFeesAmount());
        $this->assertSame($result->pockets[0]->totalDeposited, $result->firstPocket()->totalDeposited);
    }

    public function test_default_overflow_account_type_injects_a_compte_courant_pocket_when_the_last_envelope_is_capped(): void
    {
        $adapter = $this->makeAdapter();

        // Livret A ceiling is 22 950 EUR (docs/API.md §0) — 5 000 EUR/month
        // over a year deposits 60 000 EUR, well past it.
        $result = $adapter->calculate(new MultiEnvelopeCalculationInputData(
            envelopes: [$this->makeEnvelope(accountType: AccountType::LivretA, monthlyContribution: 5000.0, durationYears: 1)],
        ));

        $this->assertCount(2, $result->pockets);
        $this->assertSame(AccountType::CompteCourant, $result->pockets[1]->accountType);
    }

    public function test_null_overflow_account_type_means_no_overflow_pocket_is_injected(): void
    {
        $adapter = $this->makeAdapter();

        $result = $adapter->calculate(new MultiEnvelopeCalculationInputData(
            envelopes: [$this->makeEnvelope(accountType: AccountType::LivretA, monthlyContribution: 5000.0, durationYears: 1)],
            defaultOverflowAccountType: null,
        ));

        $this->assertCount(1, $result->pockets);
    }

    public function test_pea_pme_shares_its_ceiling_with_pea_in_the_same_cascade(): void
    {
        $adapter = $this->makeAdapter();

        // PEA ceiling: 150 000 EUR. PEA/PEA-PME shared ceiling: 225 000 EUR
        // (docs/API.md §0 and §2). An upfront 150 000 EUR on PEA leaves only
        // 75 000 EUR of shared capacity for PEA-PME's own 100 000 EUR deposit.
        $result = $adapter->calculate(new MultiEnvelopeCalculationInputData(
            envelopes: [
                $this->makeEnvelope(accountType: AccountType::Pea, initialAmount: 150_000.0),
                $this->makeEnvelope(accountType: AccountType::PeaPme, initialAmount: 100_000.0),
            ],
            defaultOverflowAccountType: null,
        ));

        $this->assertSame(75_000.0, $result->pockets[1]->totalDeposited);
        $this->assertSame(0, $result->pockets[1]->ceilingReachedMonth);
    }

    private function makeAdapter(): FinlrMultiEnvelopeAdapter
    {
        return new FinlrMultiEnvelopeAdapter(new MultiEnvelopeSimulator);
    }

    private function makeEnvelope(
        AccountType $accountType,
        float $initialAmount = 0.0,
        float $monthlyContribution = 100.0,
        int $durationYears = 1,
    ): EnvelopeConfigData {
        return new EnvelopeConfigData(
            accountType: $accountType,
            initialAmount: $initialAmount,
            monthlyContribution: $monthlyContribution,
            durationYears: $durationYears,
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
    }
}
