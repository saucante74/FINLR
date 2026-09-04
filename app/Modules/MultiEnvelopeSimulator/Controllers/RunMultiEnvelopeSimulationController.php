<?php

namespace App\Modules\MultiEnvelopeSimulator\Controllers;

use App\Modules\MultiEnvelopeSimulator\Actions\SaveMultiEnvelopeScenarioAction;
use App\Modules\MultiEnvelopeSimulator\Requests\RunMultiEnvelopeSimulationRequest;
use App\Modules\Shared\Controllers\Controller;
use App\Modules\SimulationEngine\Actions\RunMultiEnvelopeCalculationAction;
use Illuminate\Http\RedirectResponse;

class RunMultiEnvelopeSimulationController extends Controller
{
    public function __invoke(
        RunMultiEnvelopeSimulationRequest $request,
        RunMultiEnvelopeCalculationAction $run,
        SaveMultiEnvelopeScenarioAction $save,
    ): RedirectResponse {
        $input = $request->toData();
        $result = $run->handle($input);
        $scenario = $save->handle($request->user(), $input, $result, $request->name());

        return redirect()->route('scenarios.show', $scenario);
    }
}
