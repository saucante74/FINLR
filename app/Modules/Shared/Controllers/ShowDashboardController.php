<?php

namespace App\Modules\Shared\Controllers;

use App\Modules\Scenarios\Actions\ListUserScenariosAction;
use App\Modules\Scenarios\DTOs\ScenarioSummaryData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowDashboardController extends Controller
{
    public function __invoke(Request $request, ListUserScenariosAction $listScenarios): Response
    {
        return Inertia::render('Dashboard', [
            'scenarios' => array_map(
                fn (ScenarioSummaryData $scenario): array => $scenario->toArray(),
                $listScenarios->handle($request->user()),
            ),
        ]);
    }
}
