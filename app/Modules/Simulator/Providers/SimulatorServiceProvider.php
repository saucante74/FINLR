<?php

namespace App\Modules\Simulator\Providers;

use App\Modules\Simulator\Contracts\SimulationEngineInterface;
use App\Modules\Simulator\Services\FinlrEngineAdapter;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use RuntimeException;

class SimulatorServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SimulationEngineInterface::class, function (Application $app): SimulationEngineInterface {
            if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
                throw new RuntimeException(
                    'The private saucante74/finlr-engine package is not installed. '.
                    SimulationEngineInterface::class.' cannot be resolved without it.'
                );
            }

            return $app->make(FinlrEngineAdapter::class);
        });
    }
}
