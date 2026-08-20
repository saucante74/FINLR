<?php

namespace App\Modules\SingleEnvelopeSimulator\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\SingleEnvelopeSimulator\DTOs\SimulatorDefaultsData;
use Inertia\Inertia;
use Inertia\Response;

class ShowSingleEnvelopeSimulatorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('simulator/SingleEnvelopeSimulator', [
            'defaults' => SimulatorDefaultsData::default()->toArray(),
        ]);
    }
}
