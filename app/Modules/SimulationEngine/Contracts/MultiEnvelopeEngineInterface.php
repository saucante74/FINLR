<?php

namespace App\Modules\SimulationEngine\Contracts;

use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationResultData;

interface MultiEnvelopeEngineInterface
{
    public function calculate(MultiEnvelopeCalculationInputData $input): MultiEnvelopeCalculationResultData;
}
