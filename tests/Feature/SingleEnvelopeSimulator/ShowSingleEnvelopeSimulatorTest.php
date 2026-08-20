<?php

namespace Tests\Feature\SingleEnvelopeSimulator;

use App\Modules\SingleEnvelopeSimulator\DTOs\SimulatorDefaultsData;
use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShowSingleEnvelopeSimulatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_free_plan_user_receives_a_403(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::FREE]);

        $response = $this->actingAs($user)->get('/simulators/single-envelope');

        $response->assertForbidden();
    }

    public function test_a_pro_plan_user_receives_200_with_the_expected_inertia_component(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($user)->get('/simulators/single-envelope');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('simulator/SingleEnvelopeSimulator'));
    }

    public function test_it_passes_the_ten_default_values_as_the_defaults_prop(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($user)->get('/simulators/single-envelope');

        // Inertia props travel to the browser as JSON: whole-number floats
        // (e.g. 6.0) lose their float type on the wire, same as any other
        // PHP value round-tripped through json_encode/json_decode. The
        // expected side is normalized through the same round-trip so the
        // comparison reflects what the browser actually receives.
        $expectedDefaults = json_decode(
            json_encode(SimulatorDefaultsData::default()->toArray()),
            true,
        );

        $response->assertInertia(fn (Assert $page) => $page
            ->component('simulator/SingleEnvelopeSimulator')
            ->where('defaults', $expectedDefaults)
        );
    }
}
