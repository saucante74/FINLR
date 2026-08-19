<?php

namespace Tests\Feature\FreemiumCalculator;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FreemiumCalculatorPageTest extends TestCase
{
    public function test_home_page_is_accessible_and_renders_the_calculator_component(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('FreemiumCalculator'));
    }

    public function test_home_page_exposes_authentication_route_availability(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('canLogin', true)
            ->where('canRegister', true)
        );
    }
}
