<?php

namespace App\Modules\SimulationEngine\Contracts;

use App\Modules\SimulationEngine\DTOs\AnalogyComparisonInputData;
use App\Modules\SimulationEngine\DTOs\AnalogyResultData;

interface AnalogyEngineInterface
{
    public function compare(AnalogyComparisonInputData $input): AnalogyResultData;
}
