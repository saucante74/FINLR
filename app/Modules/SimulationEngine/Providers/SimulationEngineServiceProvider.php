<?php

namespace App\Modules\SimulationEngine\Providers;

use App\Modules\SimulationEngine\Contracts\AnalogyEngineInterface;
use App\Modules\SimulationEngine\Contracts\FireEngineInterface;
use App\Modules\SimulationEngine\Contracts\MultiEnvelopeEngineInterface;
use App\Modules\SimulationEngine\Contracts\SimulationEngineInterface;
use App\Modules\SimulationEngine\Services\FinlrAnalogyAdapter;
use App\Modules\SimulationEngine\Services\FinlrEngineAdapter;
use App\Modules\SimulationEngine\Services\FinlrFireAdapter;
use App\Modules\SimulationEngine\Services\FinlrMultiEnvelopeAdapter;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use RuntimeException;

class SimulationEngineServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SimulationEngineInterface::class, function (Application $app): SimulationEngineInterface {
            $this->guardPackageIsInstalled(SimulationEngineInterface::class);

            return $app->make(FinlrEngineAdapter::class);
        });

        $this->app->bind(MultiEnvelopeEngineInterface::class, function (Application $app): MultiEnvelopeEngineInterface {
            $this->guardPackageIsInstalled(MultiEnvelopeEngineInterface::class);

            return $app->make(FinlrMultiEnvelopeAdapter::class);
        });

        $this->app->bind(AnalogyEngineInterface::class, function (Application $app): AnalogyEngineInterface {
            $this->guardPackageIsInstalled(AnalogyEngineInterface::class);

            return $app->make(FinlrAnalogyAdapter::class);
        });

        $this->app->bind(FireEngineInterface::class, function (Application $app): FireEngineInterface {
            $this->guardPackageIsInstalled(FireEngineInterface::class);

            return $app->make(FinlrFireAdapter::class);
        });
    }

    /**
     * @param  class-string  $interface
     */
    private function guardPackageIsInstalled(string $interface): void
    {
        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            throw new RuntimeException(
                'The private saucante74/finlr-engine package is not installed. '.
                $interface.' cannot be resolved without it.'
            );
        }
    }
}
