<?php

use App\Modules\Auth\Providers\RateLimitServiceProvider;
use App\Modules\Calculator\Providers\CalculatorServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    RateLimitServiceProvider::class,
    CalculatorServiceProvider::class,
];
