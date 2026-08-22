<?php

namespace App\Modules\SingleEnvelopeSimulator\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\SimulationEngine\Enums\TaxWrapper;
use App\Modules\SingleEnvelopeSimulator\Enums\Jurisdiction;
use Inertia\Inertia;
use Inertia\Response;

class ShowWrapperChoiceController extends Controller
{
    public function __invoke(): Response
    {
        // Entry point of the simulator: the jurisdiction is not a URL
        // segment here because only one exists. When a second one ships,
        // this becomes the jurisdiction picker rather than a hardcoded case.
        $jurisdiction = Jurisdiction::France;

        return Inertia::render('simulator/ChooseWrapper', [
            'jurisdiction' => $jurisdiction->value,
            'wrappers' => array_map(
                fn (TaxWrapper $wrapper): string => $wrapper->value,
                $jurisdiction->wrappers(),
            ),
        ]);
    }
}
