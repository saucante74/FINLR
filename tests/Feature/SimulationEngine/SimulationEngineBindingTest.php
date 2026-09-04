<?php

namespace Tests\Feature\SimulationEngine;

use App\Modules\SimulationEngine\Actions\CalculateProjectionAction;
use App\Modules\SimulationEngine\Contracts\AnalogyEngineInterface;
use App\Modules\SimulationEngine\Contracts\FireEngineInterface;
use App\Modules\SimulationEngine\Contracts\MultiEnvelopeEngineInterface;
use App\Modules\SimulationEngine\Contracts\SimulationEngineInterface;
use App\Modules\SimulationEngine\Services\FinlrAnalogyAdapter;
use App\Modules\SimulationEngine\Services\FinlrEngineAdapter;
use App\Modules\SimulationEngine\Services\FinlrFireAdapter;
use App\Modules\SimulationEngine\Services\FinlrMultiEnvelopeAdapter;
use Tests\TestCase;

class SimulationEngineBindingTest extends TestCase
{
    public function test_the_finlr_engine_adapter_is_bound_when_the_private_package_is_present(): void
    {
        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }

        $engine = $this->app->make(SimulationEngineInterface::class);

        $this->assertInstanceOf(FinlrEngineAdapter::class, $engine);
    }

    public function test_the_finlr_multi_envelope_adapter_is_bound_when_the_private_package_is_present(): void
    {
        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }

        $engine = $this->app->make(MultiEnvelopeEngineInterface::class);

        $this->assertInstanceOf(FinlrMultiEnvelopeAdapter::class, $engine);
    }

    public function test_the_finlr_analogy_adapter_is_bound_when_the_private_package_is_present(): void
    {
        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }

        $engine = $this->app->make(AnalogyEngineInterface::class);

        $this->assertInstanceOf(FinlrAnalogyAdapter::class, $engine);
    }

    public function test_the_finlr_fire_adapter_is_bound_when_the_private_package_is_present(): void
    {
        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }

        $engine = $this->app->make(FireEngineInterface::class);

        $this->assertInstanceOf(FinlrFireAdapter::class, $engine);
    }

    public function test_the_calculate_projection_action_resolves_through_the_container(): void
    {
        $action = $this->app->make(CalculateProjectionAction::class);

        $this->assertInstanceOf(CalculateProjectionAction::class, $action);
    }
}
