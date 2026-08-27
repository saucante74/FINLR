<?php

/*
|--------------------------------------------------------------------------
| Validation Language Lines (French)
|--------------------------------------------------------------------------
|
| Partial override of Laravel's default validation.php: only the rules
| actually triggered by this app's forms are translated here. Any other
| rule falls back to lang/en/validation.php (config('app.fallback_locale')),
| which was already the behaviour for every rule before this file existed.
|
*/

return [

    'required' => 'Le champ :attribute est obligatoire.',
    'confirmed' => 'La confirmation du champ :attribute ne correspond pas.',
    'current_password' => 'Le mot de passe est incorrect.',
    'email' => 'Le champ :attribute doit être une adresse e-mail valide.',
    'string' => 'Le champ :attribute doit être une chaîne de caractères.',

    'min' => [
        'string' => 'Le champ :attribute doit contenir au moins :min caractères.',
    ],

    'password' => [
        'letters' => 'Le champ :attribute doit contenir au moins une lettre.',
        'mixed' => 'Le champ :attribute doit contenir au moins une majuscule et une minuscule.',
        'numbers' => 'Le champ :attribute doit contenir au moins un chiffre.',
        'symbols' => 'Le champ :attribute doit contenir au moins un caractère spécial.',
        'uncompromised' => 'Le champ :attribute donné a été exposé dans une fuite de données. Merci de choisir un autre :attribute.',
    ],

    'attributes' => [
        'name' => 'nom complet',
        'email' => 'adresse e-mail',
        'password' => 'mot de passe',
        'password_confirmation' => 'confirmation du mot de passe',
        'current_password' => 'mot de passe actuel',
    ],

];
