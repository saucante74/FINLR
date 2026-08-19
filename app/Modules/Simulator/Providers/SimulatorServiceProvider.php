<?php

namespace App\Modules\Simulator\Providers;

use App\Modules\Simulator\Contracts\SimulationEngineInterface;
use App\Modules\Simulator\Services\DummyCalculatorEngine;
use App\Modules\Simulator\Services\FinlrEngineAdapter;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class SimulatorServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SimulationEngineInterface::class, function (Application $app): SimulationEngineInterface {
            if (class_exists('saucante74\\CalculatorEngine\\CalculatorEngine') && ! config('calculator.force_dummy')) {
                return $app->make(FinlrEngineAdapter::class);
            }

            return $app->make(DummyCalculatorEngine::class);
        });
    }
}
