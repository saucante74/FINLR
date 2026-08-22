<?php

namespace App\Modules\Scenarios\Controllers;

use App\Modules\Scenarios\Models\Scenario;
use App\Modules\Shared\Controllers\Concerns\AuthorizesResourceOwnership;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowScenarioController extends Controller
{
    use AuthorizesResourceOwnership;

    public function __invoke(Request $request, Scenario $scenario): Response
    {
        $this->abortUnlessOwner($request->user(), $scenario->user_id);

        return Inertia::render('scenario/ScenarioShow', [
            'id' => $scenario->id,
            'input' => $scenario->input_payload,
            'result' => $scenario->result_payload,
            'calculatorType' => $scenario->calculator_type->value,
            'createdAt' => $scenario->created_at?->toISOString(),
            'name' => $scenario->name,
        ]);
    }
}
