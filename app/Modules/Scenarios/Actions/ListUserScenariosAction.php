<?php

namespace App\Modules\Scenarios\Actions;

use App\Modules\Scenarios\DTOs\ScenarioSummaryData;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\User\Models\User;

class ListUserScenariosAction
{
    /**
     * @return array<int, ScenarioSummaryData>
     */
    public function handle(User $user): array
    {
        return Scenario::query()
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn (Scenario $scenario): ScenarioSummaryData => ScenarioSummaryData::fromModel($scenario))
            ->all();
    }
}
