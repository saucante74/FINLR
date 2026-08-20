<?php

use App\Modules\Auth\Providers\RateLimitServiceProvider;
use App\Modules\SimulationEngine\Providers\SimulationEngineServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    RateLimitServiceProvider::class,
    SimulationEngineServiceProvider::class,
];
