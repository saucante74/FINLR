<?php

namespace App\Modules\SimulationEngine\Enums;

use saucante74\CalculatorEngine\Enums\AccountType as PackageAccountType;

/**
 * Mirror of saucante74\CalculatorEngine\Enums\AccountType (8 cases,
 * docs/API.md §0). Case values are byte-identical to the package's so
 * conversion is a plain value round-trip, never a match() dispersed across
 * adapters (CLAUDE.md: a rule tied to an enum case is a method of that
 * enum).
 */
enum AccountType: string
{
    case Pea = 'PEA';
    case PeaPme = 'PEA_PME';
    case Cto = 'CTO';
    case AssuranceVie = 'ASSURANCE_VIE';
    case Cat = 'CAT';
    case LivretA = 'LIVRET_A';
    case Ldds = 'LDDS';
    case CompteCourant = 'COMPTE_COURANT';

    public function toPackage(): PackageAccountType
    {
        return PackageAccountType::from($this->value);
    }

    public static function fromPackage(PackageAccountType $accountType): self
    {
        return self::from($accountType->value);
    }
}
