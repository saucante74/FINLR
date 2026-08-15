<?php

namespace App\Modules\Calculator\DTOs;

use App\Modules\Calculator\Enums\TaxWrapper;

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
