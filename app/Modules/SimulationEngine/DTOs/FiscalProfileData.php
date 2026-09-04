<?php

namespace App\Modules\SimulationEngine\DTOs;

use App\Modules\SimulationEngine\Enums\TaxRegime;

/**
 * Mirror of saucante74\CalculatorEngine\Strategies\FiscalProfile
 * (docs/API.md §0). The five rate/threshold fields default to `null`
 * ("use the package's own FiscalRates default") rather than duplicating
 * those figures here — CLAUDE.md forbids hardcoding fiscal values outside
 * their single source of truth.
 */
readonly class FiscalProfileData
{
    public function __construct(
        public ?float $marginalIncomeTaxRate = null,
        public ?TaxRegime $forcedRegime = null,
        public bool $isCoupleHousehold = false,
        public ?float $socialLeviesStandard = null,
        public ?float $socialLeviesReduced = null,
        public ?float $flatTaxIncomeRate = null,
        public ?float $lifeInsuranceReducedRate = null,
        public ?float $lifeInsurancePremiumThreshold = null,
    ) {}
}
