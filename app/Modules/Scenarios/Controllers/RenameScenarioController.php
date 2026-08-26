<?php

namespace App\Modules\Scenarios\Controllers;

use App\Modules\Scenarios\Actions\RenameScenarioAction;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\Scenarios\Requests\RenameScenarioRequest;
use App\Modules\Shared\Controllers\Concerns\AuthorizesResourceOwnership;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class RenameScenarioController extends Controller
{
    use AuthorizesResourceOwnership;

    public function __invoke(RenameScenarioRequest $request, Scenario $scenario, RenameScenarioAction $action): RedirectResponse
    {
        $this->abortUnlessOwner($request->user(), $scenario->user_id);

        $action->handle($scenario, $request->name());

        return redirect()->route('scenarios.show', $scenario);
    }
}
