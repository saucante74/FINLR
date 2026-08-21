<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Normalize a PHP value the same way an Inertia prop is normalized on
     * its way to the browser (a json_encode/json_decode round-trip), so it
     * can be compared to a prop actually received in a test without failing
     * on representation differences alone (e.g. a whole-number float such
     * as 6.0 losing its float type once decoded from JSON).
     *
     * @param  array<array-key, mixed>  $value
     * @return array<array-key, mixed>
     */
    protected function normalizeForJsonComparison(array $value): array
    {
        return json_decode(json_encode($value), true);
    }
}
