<?php

namespace App\Modules\SimulationEngine\DTOs;

use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Enums\TaxRegime;

/**
 * Mirror of saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\DTOs\PocketResult
 * (docs/API.md §2), one per envelope of a cascade.
 */
readonly class PocketResultData
{
    public function __construct(
        public AccountType $accountType,
        public float $initialDeposit,
        public float $dcaDeposited,
        public float $totalDeposited,
        public int $dcaMonthsCount,
        public float $lastDcaAmount,
        public float $firstResidualDcaAmount,
        public ?int $ceilingReachedMonth,
        public float $grossBalance,
        public float $totalGains,
        public float $taxesAmount,
        public float $incomeTaxAmount,
        public float $socialLeviesAmount,
        public TaxRegime $taxRegime,
        public float $netBalance,
        public float $brokerageFeesAmount = 0.0,
        public float $managementFeesAmount = 0.0,
        public float $terImpactAmount = 0.0,
        public float $custodyFeesAmount = 0.0,
        public float $arbitrageFeesAmount = 0.0,
    ) {}

    public function totalFeesAmount(): float
    {
        return $this->brokerageFeesAmount
            + $this->managementFeesAmount
            + $this->terImpactAmount
            + $this->custodyFeesAmount
            + $this->arbitrageFeesAmount;
    }
}
