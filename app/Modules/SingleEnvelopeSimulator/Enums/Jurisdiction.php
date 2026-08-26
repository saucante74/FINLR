<?php

namespace App\Modules\SingleEnvelopeSimulator\Enums;

use App\Modules\SimulationEngine\Enums\TaxWrapper;

/**
 * Routing/navigation dimension only: which tax wrappers a country offers.
 * Deliberately absent from CalculationInputData and from the Scenario model —
 * with a single jurisdiction live, the engine has no use for it, and adding
 * it there would be a data dimension nothing actually varies on yet.
 */
enum Jurisdiction: string
{
    case France = 'france';

    /**
     * @return list<TaxWrapper>
     */
    public function wrappers(): array
    {
        return match ($this) {
            self::France => [TaxWrapper::Pea, TaxWrapper::Cto],
        };
    }

    public function supports(TaxWrapper $wrapper): bool
    {
        return in_array($wrapper, $this->wrappers(), strict: true);
    }
}
