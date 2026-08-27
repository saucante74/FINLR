<?php

/*
|--------------------------------------------------------------------------
| Validation Language Lines (Italian)
|--------------------------------------------------------------------------
|
| Partial override of Laravel's default validation.php: only the rules
| actually triggered by this app's forms are translated here. Any other
| rule falls back to lang/en/validation.php (config('app.fallback_locale')),
| which was already the behaviour for every rule before this file existed.
|
*/

return [

    'required' => 'Il campo :attribute è obbligatorio.',
    'confirmed' => 'La conferma del campo :attribute non corrisponde.',
    'current_password' => 'La password non è corretta.',
    'email' => 'Il campo :attribute deve essere un indirizzo e-mail valido.',
    'string' => 'Il campo :attribute deve essere una stringa di caratteri.',

    'min' => [
        'string' => 'Il campo :attribute deve contenere almeno :min caratteri.',
    ],

    'password' => [
        'letters' => 'Il campo :attribute deve contenere almeno una lettera.',
        'mixed' => 'Il campo :attribute deve contenere almeno una lettera maiuscola e una minuscola.',
        'numbers' => 'Il campo :attribute deve contenere almeno un numero.',
        'symbols' => 'Il campo :attribute deve contenere almeno un carattere speciale.',
        'uncompromised' => 'Il valore fornito per :attribute è comparso in una violazione di dati. Scegli un altro :attribute.',
    ],

    'attributes' => [
        'name' => 'nome completo',
        'email' => 'indirizzo e-mail',
        'password' => 'password',
        'password_confirmation' => 'conferma della password',
        'current_password' => 'password attuale',
    ],

];
