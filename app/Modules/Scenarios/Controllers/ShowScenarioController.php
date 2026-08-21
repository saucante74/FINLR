<?php

namespace App\Modules\Scenarios\Controllers;

use App\Modules\Scenarios\Models\Scenario;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowScenarioController extends Controller
{
    public function __invoke(Request $request, Scenario $scenario): Response
    {
        $user = $request->user();

        if (! $user || $scenario->user_id !== $user->id) {
            abort(404);
        }

        return Inertia::render('scenario/ScenarioShow', [
            'input' => $scenario->input_payload,
            'result' => $scenario->result_payload,
            'calculatorType' => $scenario->calculator_type->value,
            'createdAt' => $scenario->created_at?->toISOString(),
        ]);
    }
}
