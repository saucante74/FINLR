<?php

namespace Tests\Feature\Simulator;

use App\Modules\Simulator\Actions\CalculateProjectionAction;
use App\Modules\Simulator\Contracts\SimulationEngineInterface;
use App\Modules\Simulator\Services\DummyCalculatorEngine;
use App\Modules\Simulator\Services\FinlrEngineAdapter;
use Tests\TestCase;

class SimulationEngineBindingTest extends TestCase
{
    public function test_the_finlr_engine_adapter_is_bound_when_the_private_package_is_present(): void
    {
        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
        config(['calculator.force_dummy' => false]);

        $engine = $this->app->make(SimulationEngineInterface::class);

        $this->assertInstanceOf(FinlrEngineAdapter::class, $engine);
    }

    public function test_the_dummy_engine_is_bound_when_force_dummy_is_enabled(): void
    {
        config(['calculator.force_dummy' => true]);

        $engine = $this->app->make(SimulationEngineInterface::class);

        $this->assertInstanceOf(DummyCalculatorEngine::class, $engine);
    }

    public function test_the_calculate_projection_action_resolves_through_the_container(): void
    {
        $action = $this->app->make(CalculateProjectionAction::class);

        $this->assertInstanceOf(CalculateProjectionAction::class, $action);
    }
}
