<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Taux de taxe suggérés par enveloppe
    |--------------------------------------------------------------------------
    |
    | Taux de taxation sur la plus-value (en pourcentage) suggérés à
    | l'utilisateur selon l'enveloppe fiscale choisie (UC-1.1).
    |
    */

    'tax_suggestions' => [
        'pea' => 17.2,
        'cto' => 30,
        'av' => 24.7,
    ],

    /*
    |--------------------------------------------------------------------------
    | Paramètres par défaut du moteur de calcul
    |--------------------------------------------------------------------------
    |
    | Valeurs pré-remplies dans le formulaire de simulation d'intérêts
    | composés lors du premier affichage de la calculatrice.
    |
    */

    'defaults' => [
        'initial_capital' => 10000,
        'monthly_contribution' => 300,
        'annual_rate' => 7,
        'years' => 20,
        'wrapper_fee' => 0.5,
        'fund_fee' => 0.3,
        'tax_rate' => 17.2,
    ],

];
