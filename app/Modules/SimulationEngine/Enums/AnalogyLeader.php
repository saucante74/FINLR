<?php

namespace App\Modules\SimulationEngine\Enums;

use saucante74\CalculatorEngine\Analogy\Enums\AnalogyLeader as PackageAnalogyLeader;

/**
 * Mirror of saucante74\CalculatorEngine\Analogy\Enums\AnalogyLeader (3
 * cases): which scenario leads, as data, never a verdict — the package's
 * own docblock is explicit about this, kept true on the app side too.
 */
enum AnalogyLeader: string
{
    case ScenarioA = 'SCENARIO_A';
    case ScenarioB = 'SCENARIO_B';
    case Tie = 'TIE';

    public function toPackage(): PackageAnalogyLeader
    {
        return PackageAnalogyLeader::from($this->value);
    }

    public static function fromPackage(PackageAnalogyLeader $leader): self
    {
        return self::from($leader->value);
    }
}
