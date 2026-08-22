<?php

namespace App\Modules\Scenarios\Actions;

use App\Modules\Scenarios\Models\Scenario;

class RenameScenarioAction
{
    public function handle(Scenario $scenario, ?string $name): void
    {
        $scenario->update(['name' => $name]);
    }
}
