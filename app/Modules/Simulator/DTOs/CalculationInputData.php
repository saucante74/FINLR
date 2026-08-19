<?php

namespace App\Modules\Simulator\DTOs;

use App\Modules\Simulator\Enums\TaxWrapper;

readonly class CalculationInputData
{
    public function __construct(
        public float $initialCapital,
        public float $monthlyContribution,
        public float $annualRate,
        public int $years,
        public float $wrapperFee,
        public float $fundFee,
        public float $taxRate,
        public float $inflationRate,
        public bool $inflationEnabled,
        public TaxWrapper $wrapper,
    ) {}
}
