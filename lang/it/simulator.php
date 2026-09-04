<?php

/**
 * Backend-only mirror of the `simulator.*` keys actually resolved via
 * Laravel's __() helper (app/Modules/AnalogySimulator/Requests/
 * RunAnalogyComparisonRequest.php, app/Modules/FireSimulator/Controllers/
 * RunFireProjectionController.php, bootstrap/app.php) — not a duplication
 * of the whole frontend catalog in lang/it.json.
 *
 * __() never reads lang/{locale}.json by dotted path: that nested file is
 * i18next's own convention (consumed by resources/js/i18n.ts), unrelated to
 * Laravel's translator. A dotted key passed to __() is parsed as
 * "group.item" and resolved against lang/{locale}/{group}.php — this file
 * is that "simulator" group. Before this file existed, every one of the
 * three __() calls above silently returned its own raw key string instead
 * of a translation (verified via tinker, identically in fr/en/it) — this
 * was the actual root cause of the Analogy defaultLabelA/defaultLabelB bug,
 * not a duplicated JSON key. Keep these values in sync with the
 * corresponding simulator.* entries in lang/it.json.
 */
return [
    'analogy' => [
        'defaultLabelA' => 'Scenario A',
        'defaultLabelB' => 'Scenario B',
    ],
    'calculationFailed' => 'Il calcolo non è andato a buon fine. Riprova tra qualche istante.',
    'fire' => [
        'form' => [
            'invalidInput' => 'I valori inseriti non permettono di calcolare questa proiezione FIRE. Controlla i tuoi dati.',
        ],
    ],
];
