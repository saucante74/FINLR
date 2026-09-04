<?php

namespace Tests\Feature\MultiEnvelopeSimulator;

use App\Modules\MultiEnvelopeSimulator\DTOs\SimulatorDefaultsData;
use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShowMultiEnvelopeSimulatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_free_plan_user_receives_a_403(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::FREE]);

        $response = $this->actingAs($user)->get('/simulators/multi-envelope');

        $response->assertForbidden();
    }

    public function test_a_pro_plan_user_receives_200_with_the_expected_inertia_component(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($user)->get('/simulators/multi-envelope');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('simulator/MultiEnvelopeSimulator'));
    }

    public function test_it_passes_the_six_default_values_as_the_defaults_prop(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($user)->get('/simulators/multi-envelope');

        // Inertia props travel to the browser as JSON: whole-number floats
        // (e.g. 6.0) lose their float type on the wire, same as any other
        // PHP value round-tripped through json_encode/json_decode. The
        // expected side is normalized through the same round-trip so the
        // comparison reflects what the browser actually receives.
        $expectedDefaults = $this->normalizeForJsonComparison(SimulatorDefaultsData::default()->toArray());

        $response->assertInertia(fn (Assert $page) => $page
            ->component('simulator/MultiEnvelopeSimulator')
            ->where('defaults', $expectedDefaults)
        );
    }

    public function test_it_passes_the_eight_account_types_as_the_account_types_prop(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($user)->get('/simulators/multi-envelope');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('simulator/MultiEnvelopeSimulator')
            ->has('accountTypes', 8)
            ->where('accountTypes', [
                'PEA', 'PEA_PME', 'CTO', 'ASSURANCE_VIE', 'CAT', 'LIVRET_A', 'LDDS', 'COMPTE_COURANT',
            ])
        );
    }

    public function test_an_unauthenticated_visitor_is_redirected_to_login(): void
    {
        $response = $this->get('/simulators/multi-envelope');

        $response->assertRedirect(route('login'));
    }
}
