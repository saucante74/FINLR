<?php

namespace Tests\Feature\FreemiumCalculator;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FreemiumCalculatorPageTest extends TestCase
{
    public function test_calculator_page_is_accessible_and_renders_the_calculator_component(): void
    {
        $response = $this->get('/calculator');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page->component('FreemiumCalculator'));
    }

    public function test_calculator_page_exposes_authentication_route_availability(): void
    {
        $response = $this->get('/calculator');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('canLogin', true)
            ->where('canRegister', true)
        );
    }

    /**
     * The calculator moved off "/" when the marketing landing page took that
     * URL over, but its route name did not change: every internal
     * route('calculator.freemium') link must still resolve to it.
     */
    public function test_the_calculator_route_name_still_points_at_the_moved_url(): void
    {
        $this->assertSame('http://localhost/calculator', route('calculator.freemium'));
    }
}
