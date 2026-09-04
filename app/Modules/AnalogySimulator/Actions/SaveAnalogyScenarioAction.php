<?php

namespace App\Modules\AnalogySimulator\Actions;

use App\Modules\AnalogySimulator\Support\AnalogyScenarioPayload;
use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\DTOs\AnalogyComparisonInputData;
use App\Modules\SimulationEngine\DTOs\AnalogyResultData;
use App\Modules\SimulationEngine\Support\EngineVersion;
use App\Modules\User\Models\User;

class SaveAnalogyScenarioAction
{
    public function handle(
        User $user,
        AnalogyComparisonInputData $input,
        AnalogyResultData $result,
        ?string $name = null,
    ): Scenario {
        return Scenario::create([
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::Analogy,
            'name' => $name,
            'input_payload' => AnalogyScenarioPayload::input($input),
            'result_payload' => AnalogyScenarioPayload::result($result),
            'engine_version' => EngineVersion::current(),
        ]);
    }
}
