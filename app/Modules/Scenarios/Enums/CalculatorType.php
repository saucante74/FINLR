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
    case MultiEnvelope = 'multi_envelope';

    /**
     * Extraction minimale des 3 champs affichés par la liste de scénarios
     * du dashboard, à partir des payloads bruts stockés en base — chaque
     * cas lit une forme de payload différente (miroir de son propre DTO
     * SimulationEngine), d'où le match() ici plutôt que dans
     * ScenarioSummaryData (CLAUDE.md : une règle qui dépend d'un cas
     * d'enum est une méthode de l'enum, jamais un match() dispersé).
     *
     * Généralisation partielle : seuls SingleEnvelope et MultiEnvelope
     * sont couverts. Analogy et Fire n'ont pas de $wrapper/$years évidents
     * (Analogy compare deux enveloppes qui peuvent différer, Fire n'a pas
     * d'enveloppe du tout) — une vraie généralisation de
     * ScenarioSummaryData attendra que les 3 types restants existent tous,
     * plutôt que de forcer un troisième cas dans ce contrat à 3 champs
     * avant de savoir ce qu'il doit réellement montrer.
     *
     * @param  array<string, mixed>  $inputPayload
     * @param  array<string, mixed>  $resultPayload
     * @return array{headlineFigure: float, wrapper: string, years: int}
     */
    public function summarize(array $inputPayload, array $resultPayload): array
    {
        return match ($this) {
            self::SingleEnvelope => [
                'headlineFigure' => (float) ($resultPayload['finalNetReal'] ?? 0.0),
                'wrapper' => (string) ($inputPayload['wrapper'] ?? ''),
                'years' => (int) ($inputPayload['years'] ?? 0),
            ],
            // No single wrapper applies to a cascade of several envelope
            // types: left blank rather than picking one arbitrarily.
            // ScenarioList.tsx already renders an unrecognised wrapper as
            // "—", so this needs no frontend change to display correctly.
            self::MultiEnvelope => [
                'headlineFigure' => (float) (($resultPayload['summary'] ?? [])['netBalance'] ?? 0.0),
                'wrapper' => '',
                'years' => (int) (($resultPayload['summary'] ?? [])['year'] ?? 0),
            ],
        };
    }
}
