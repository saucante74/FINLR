<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Forcer le moteur de secours
    |--------------------------------------------------------------------------
    |
    | Lorsque activé, force l'utilisation de DummyCalculatorEngine même si le
    | paquet privé saucante74/finlr-engine est installé (utile pour les
    | environnements de démonstration ou de test sans règles fiscales réelles).
    |
    */

    'force_dummy' => env('CALCULATOR_FORCE_DUMMY', false),

];
