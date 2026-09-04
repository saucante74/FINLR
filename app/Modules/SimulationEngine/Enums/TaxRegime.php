<?php

namespace App\Modules\SimulationEngine\Enums;

use saucante74\CalculatorEngine\Strategies\TaxRegime as PackageTaxRegime;

/**
 * Mirror of saucante74\CalculatorEngine\Strategies\TaxRegime (6 cases),
 * exposed on PocketResultData so the effective regime can be shown to the
 * user without leaking the package enum outside the SimulationEngine
 * adapters (CLAUDE.md, règle cardinale).
 */
enum TaxRegime: string
{
    case FlatTax = 'FLAT_TAX';
    case ProgressiveScale = 'PROGRESSIVE_SCALE';
    case LifeInsuranceReduced = 'LIFE_INSURANCE_REDUCED';
    case SocialLeviesOnly = 'SOCIAL_LEVIES_ONLY';
    case Exempt = 'EXEMPT';
    case CustomRate = 'CUSTOM_RATE';

    public function toPackage(): PackageTaxRegime
    {
        return PackageTaxRegime::from($this->value);
    }

    public static function fromPackage(PackageTaxRegime $taxRegime): self
    {
        return self::from($taxRegime->value);
    }
}
