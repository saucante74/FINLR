<?php

namespace App\Modules\AnalogySimulator\Controllers;

use App\Modules\AnalogySimulator\DTOs\SimulatorDefaultsData;
use App\Modules\Shared\Controllers\Controller;
use App\Modules\SimulationEngine\Enums\AccountType;
use Inertia\Inertia;
use Inertia\Response;

class ShowAnalogySimulatorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('simulator/AnalogySimulator', [
            'defaults' => SimulatorDefaultsData::default()->toArray(),
            'accountTypes' => array_map(
                fn (AccountType $accountType): string => $accountType->value,
                AccountType::cases(),
            ),
        ]);
    }
}
