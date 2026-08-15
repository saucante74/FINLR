<?php

namespace Tests\Feature;

use App\Modules\Calculator\Actions\CalculateInvestmentAction;
use App\Modules\Calculator\Contracts\CalculatorEngineInterface;
use App\Modules\Calculator\Services\DummyCalculatorEngine;
use Tests\TestCase;

class CalculatorEngineBindingTest extends TestCase
{
    public function test_the_dummy_engine_is_bound_when_the_private_package_is_absent(): void
    {
        $this->assertFalse(class_exists('saucante74\\CalculatorEngine\\CalculatorEngine'));

        $engine = $this->app->make(CalculatorEngineInterface::class);

        $this->assertInstanceOf(DummyCalculatorEngine::class, $engine);
    }

    public function test_the_calculate_investment_action_resolves_through_the_container(): void
    {
        $action = $this->app->make(CalculateInvestmentAction::class);

        $this->assertInstanceOf(CalculateInvestmentAction::class, $action);
    }
}
