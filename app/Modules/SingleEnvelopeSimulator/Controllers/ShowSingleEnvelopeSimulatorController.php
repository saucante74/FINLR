<?php

namespace App\Modules\SingleEnvelopeSimulator\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\SimulationEngine\Enums\TaxWrapper;
use App\Modules\SingleEnvelopeSimulator\DTOs\SimulatorDefaultsData;
use App\Modules\SingleEnvelopeSimulator\Enums\Jurisdiction;
use Inertia\Inertia;
use Inertia\Response;

class ShowSingleEnvelopeSimulatorController extends Controller
{
    public function __invoke(Jurisdiction $jurisdiction, TaxWrapper $wrapper): Response
    {
        // A wrapper the jurisdiction does not offer makes the URL itself
        // wrong, not the submitted data — hence 404 rather than a
        // validation error. Implicit enum binding already 404s on values
        // that aren't enum cases at all; this covers valid-but-mismatched
        // pairs.
        abort_unless($jurisdiction->supports($wrapper), 404);

        return Inertia::render('simulator/SingleEnvelopeSimulator', [
            'defaults' => SimulatorDefaultsData::default()->toArray(),
            'jurisdiction' => $jurisdiction->value,
            'wrapper' => $wrapper->value,
        ]);
    }
}
