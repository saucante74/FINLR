<?php

namespace App\Modules\MultiEnvelopeSimulator\Actions;

use App\Modules\MultiEnvelopeSimulator\Support\MultiEnvelopeScenarioPayload;
use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationResultData;
use App\Modules\SimulationEngine\Support\EngineVersion;
use App\Modules\User\Models\User;

class SaveMultiEnvelopeScenarioAction
{
    public function handle(
        User $user,
        MultiEnvelopeCalculationInputData $input,
        MultiEnvelopeCalculationResultData $result,
        ?string $name = null,
    ): Scenario {
        return Scenario::create([
            'user_id' => $user->id,
            'calculator_type' => CalculatorType::MultiEnvelope,
            'name' => $name,
            'input_payload' => MultiEnvelopeScenarioPayload::input($input),
            'result_payload' => MultiEnvelopeScenarioPayload::result($result),
            'engine_version' => EngineVersion::current(),
        ]);
    }
}
