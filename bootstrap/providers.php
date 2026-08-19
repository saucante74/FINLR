<?php

use App\Modules\Auth\Providers\RateLimitServiceProvider;
use App\Modules\Simulator\Providers\SimulatorServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    RateLimitServiceProvider::class,
    SimulatorServiceProvider::class,
];
