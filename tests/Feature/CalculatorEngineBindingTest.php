<?php

namespace Tests\Feature;

use App\Modules\Calculator\Actions\CalculateInvestmentAction;
use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\Services\DummyCalculatorEngine;
use App\Modules\Calculator\Services\PrivateCalculatorEngineAdapter;
use Tests\TestCase;

class CalculatorEngineBindingTest extends TestCase
{
    public function test_the_private_adapter_is_bound_when_the_private_package_is_present(): void
    {
        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
        config(['calculator.force_dummy' => false]);

        $engine = $this->app->make(CalculatorEngineInterface::class);

        $this->assertInstanceOf(PrivateCalculatorEngineAdapter::class, $engine);
    }

    public function test_the_dummy_engine_is_bound_when_force_dummy_is_enabled(): void
    {
        config(['calculator.force_dummy' => true]);

        $engine = $this->app->make(CalculatorEngineInterface::class);

        $this->assertInstanceOf(DummyCalculatorEngine::class, $engine);
    }

    public function test_the_calculate_investment_action_resolves_through_the_container(): void
    {
        $action = $this->app->make(CalculateInvestmentAction::class);

        $this->assertInstanceOf(CalculateInvestmentAction::class, $action);
    }
}
