<?php

namespace Tests\Unit;

use App\Modules\Calculator\Services\PrivateCalculatorEngineAdapter;
use PHPUnit\Framework\TestCase;

class PrivateCalculatorEngineAdapterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    public function test_it_can_be_instantiated_once_the_private_package_is_installed(): void
    {
        $this->assertTrue(class_exists(PrivateCalculatorEngineAdapter::class));
    }
}
