<?php

namespace App\Modules\Calculator\Providers;

use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\Services\DummyCalculatorEngine;
use App\Modules\Calculator\Services\PrivateCalculatorEngineAdapter;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class CalculatorServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CalculatorEngineInterface::class, function (Application $app): CalculatorEngineInterface {
            if (class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
                return $app->make(PrivateCalculatorEngineAdapter::class);
            }

            return $app->make(DummyCalculatorEngine::class);
        });
    }
}
