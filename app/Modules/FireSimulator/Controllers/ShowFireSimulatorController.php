<?php

namespace App\Modules\FireSimulator\Controllers;

use App\Modules\FireSimulator\DTOs\SimulatorDefaultsData;
use App\Modules\Shared\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShowFireSimulatorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('simulator/FireSimulator', [
            'defaults' => SimulatorDefaultsData::default()->toArray(),
        ]);
    }
}
