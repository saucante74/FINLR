<?php

namespace App\Modules\SimulationEngine\DTOs;

use App\Modules\SimulationEngine\Enums\AccountType;

/**
 * Mirror of saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\DTOs\EnvelopeConfig
 * (docs/API.md §2). Fully self-contained: no field is shared or inherited
 * from another envelope in a cascade.
 */
readonly class EnvelopeConfigData
{
    public function __construct(
        public AccountType $accountType,
        public float $initialAmount,
        public float $monthlyContribution,
        public int $durationYears,
        public float $annualReturnRate,
        public float $terRate,
        public float $brokerageFeeRate,
        public float $managementFeeRate,
        public float $custodyFeeRate,
        public float $custodyFeeFixedMonthly,
        public float $arbitrageFeeRate,
        public float $arbitrageFeeFixed,
        public float $inflationRate,
        public bool $isUncapped = false,
        public ?float $customTaxRate = null,
    ) {}
}
