<?php

namespace App\Modules\Shared\Controllers;

use App\Modules\Scenarios\Actions\ListUserScenariosAction;
use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Shared\DTOs\PaginatedData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowDashboardController extends Controller
{
    public function __invoke(Request $request, ListUserScenariosAction $listScenarios): Response
    {
        $user = $request->user();

        // The route sits behind the `auth` middleware, so $user is never null
        // in practice; PHPStan still needs this explicit proof to allow
        // passing a non-nullable User to ListUserScenariosAction::handle().
        abort_if($user === null, 403);

        // An invalid or absent ?type= silently falls back to null (no
        // filter) rather than a 422 — this is a display filter, not a
        // form submission, so a stale/tampered value should degrade
        // gracefully instead of erroring the whole page out.
        $type = $request->enum('type', CalculatorType::class);

        return Inertia::render('Dashboard', [
            'scenarios' => PaginatedData::fromPaginator($listScenarios->handle($user, $type))->toArray(),
            'scenarioTypeFilter' => $type?->value,
        ]);
    }
}
