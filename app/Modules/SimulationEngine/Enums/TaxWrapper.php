<?php

namespace App\Modules\SimulationEngine\Enums;

/**
 * There is deliberately no Av (assurance-vie) case: the private
 * saucante74/finlr-engine package does not model life insurance as its own
 * fiscal regime. Reintroducing it must be an explicit choice made once the
 * private engine actually supports it, not an accidental byproduct of
 * re-adding a case here.
 */
enum TaxWrapper: string
{
    case Pea = 'pea';
    case Cto = 'cto';
}
