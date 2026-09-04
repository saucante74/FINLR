<?php

namespace App\Modules\MultiEnvelopeSimulator\Controllers;

use App\Modules\MultiEnvelopeSimulator\DTOs\SimulatorDefaultsData;
use App\Modules\Shared\Controllers\Controller;
use App\Modules\SimulationEngine\Enums\AccountType;
use Inertia\Inertia;
use Inertia\Response;

class ShowMultiEnvelopeSimulatorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('simulator/MultiEnvelopeSimulator', [
            'defaults' => SimulatorDefaultsData::default()->toArray(),
            'accountTypes' => array_map(
                fn (AccountType $accountType): string => $accountType->value,
                AccountType::cases(),
            ),
        ]);
    }
}
