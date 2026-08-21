<?php

namespace App\Modules\SingleEnvelopeSimulator\Actions;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\DTOs\CalculationResultData;
use App\Modules\SimulationEngine\Support\EngineVersion;
use App\Modules\User\Models\User;

class SaveSingleEnvelopeScenarioAction
{
    public function handle(User $user, CalculationInputData $input, CalculationResultData $result): Scenario
    {
        return Scenario::create([
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::SingleEnvelope,
            'input_payload' => $input->toArray(),
            'result_payload' => $result->toArray(),
            'engine_version' => EngineVersion::current(),
        ]);
    }
}
