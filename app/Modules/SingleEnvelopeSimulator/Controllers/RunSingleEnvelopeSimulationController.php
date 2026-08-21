<?php

namespace App\Modules\SingleEnvelopeSimulator\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\SimulationEngine\Actions\CalculateProjectionAction;
use App\Modules\SingleEnvelopeSimulator\Actions\SaveSingleEnvelopeScenarioAction;
use App\Modules\SingleEnvelopeSimulator\Requests\RunSingleEnvelopeSimulationRequest;
use Illuminate\Http\RedirectResponse;
use RuntimeException;

class RunSingleEnvelopeSimulationController extends Controller
{
    public function __invoke(
        RunSingleEnvelopeSimulationRequest $request,
        SaveSingleEnvelopeScenarioAction $save,
    ): RedirectResponse {
        $input = $request->toData();

        try {
            // CalculateProjectionAction is resolved here, inside the try
            // block, rather than method-injected: Laravel resolves method
            // parameters before __invoke() runs, so a container resolution
            // failure (SimulationEngineInterface unbound when the private
            // finlr-engine package is absent — see
            // SimulationEngineServiceProvider) would otherwise happen
            // outside this catch and surface as a raw 500 page.
            $result = app(CalculateProjectionAction::class)->handle($input);
        } catch (RuntimeException $exception) {
            report($exception);

            return back()->withErrors([
                'simulation' => __('simulator.singleEnvelope.form.calculationFailed'),
            ]);
        }

        $scenario = $save->handle($request->user(), $input, $result);

        return redirect()->route('scenarios.show', $scenario);
    }
}
