<?php

namespace App\Modules\SingleEnvelopeSimulator\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\SingleEnvelopeSimulator\DTOs\JurisdictionWrapperSectionData;
use App\Modules\SingleEnvelopeSimulator\Enums\Jurisdiction;
use Inertia\Inertia;
use Inertia\Response;

class ShowWrapperChoiceController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('simulator/ChooseWrapper', [
            'sections' => array_map(
                fn (Jurisdiction $jurisdiction): array => JurisdictionWrapperSectionData::fromJurisdiction($jurisdiction)->toArray(),
                Jurisdiction::cases(),
            ),
        ]);
    }
}
