<?php

namespace App\Modules\SingleEnvelopeSimulator\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\SimulationEngine\Actions\CalculateProjectionAction;
use App\Modules\SingleEnvelopeSimulator\Actions\SaveSingleEnvelopeScenarioAction;
use App\Modules\SingleEnvelopeSimulator\Requests\RunSingleEnvelopeSimulationRequest;
use Illuminate\Http\RedirectResponse;

class RunSingleEnvelopeSimulationController extends Controller
{
    public function __invoke(
        RunSingleEnvelopeSimulationRequest $request,
        CalculateProjectionAction $calculate,
        SaveSingleEnvelopeScenarioAction $save,
    ): RedirectResponse {
        $input = $request->toData();
        $result = $calculate->handle($input);
        $scenario = $save->handle($request->user(), $input, $result);

        return redirect()->route('scenarios.show', $scenario);
    }
}
