<?php

namespace App\Modules\Scenarios\Enums;

/**
 * Type de calculateur ayant produit un scénario sauvegardé.
 *
 * Chaque nouveau module simulateur (ex: SingleEnvelopeSimulator,
 * puis d'autres à venir) ajoute son propre cas ici au moment de sa
 * création. Le module Scenarios ne connaît jamais le contenu métier
 * associé à un cas : il se contente de le stocker et de le restituer.
 */
enum CalculatorType: string
{
    case SingleEnvelope = 'single_envelope';
}
