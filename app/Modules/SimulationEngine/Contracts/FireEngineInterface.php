<?php

namespace App\Modules\SimulationEngine\Contracts;

use App\Modules\SimulationEngine\DTOs\FireProjectionInputData;
use App\Modules\SimulationEngine\DTOs\FireProjectionResultData;

interface FireEngineInterface
{
    public function project(FireProjectionInputData $input): FireProjectionResultData;
}
