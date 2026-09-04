<?php

namespace App\Modules\FireSimulator\Actions;

use App\Modules\FireSimulator\Support\FireScenarioPayload;
use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use App\Modules\SimulationEngine\DTOs\FireProjectionResultData;
use App\Modules\SimulationEngine\Support\EngineVersion;
use App\Modules\User\Models\User;

class SaveFireScenarioAction
{
    public function handle(
        User $user,
        FireProjectionInputData $input,
        FireProjectionResultData $result,
        ?string $name = null,
    ): Scenario {
        return Scenario::create([
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::Fire,
            'name' => $name,
            'input_payload' => FireScenarioPayload::input($input),
            'result_payload' => FireScenarioPayload::result($result),
            'engine_version' => EngineVersion::current(),
        ]);
    }
}
