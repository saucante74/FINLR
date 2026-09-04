<?php

namespace App\Modules\AnalogySimulator\Controllers;

use App\Modules\AnalogySimulator\Actions\SaveAnalogyScenarioAction;
use App\Modules\AnalogySimulator\Requests\RunAnalogyComparisonRequest;
use App\Modules\Shared\Controllers\Controller;
use App\Modules\SimulationEngine\Actions\RunAnalogyComparisonAction;
use Illuminate\Http\RedirectResponse;

class RunAnalogyComparisonController extends Controller
{
    public function __invoke(
        RunAnalogyComparisonRequest $request,
        RunAnalogyComparisonAction $run,
        SaveAnalogyScenarioAction $save,
    ): RedirectResponse {
        $input = $request->toData();
        $result = $run->handle($input);
        $scenario = $save->handle($request->user(), $input, $result, $request->name());

        return redirect()->route('scenarios.show', $scenario);
    }
}
