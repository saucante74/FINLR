<?php

namespace Tests\Feature\SingleEnvelopeSimulator;

use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShowWrapperChoiceTest extends TestCase
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
        $response->assertInertia(fn (Assert $page) => $page->component('simulator/ChooseWrapper'));
    }

    public function test_it_passes_one_section_per_jurisdiction_with_its_wrappers(): void
    {
        $user = User::factory()->create(['subscription_plan' => Plan::PRO_MONTHLY]);

        $response = $this->actingAs($user)->get('/simulators/single-envelope');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('simulator/ChooseWrapper')
            ->where('sections', [
                ['jurisdiction' => 'france', 'wrappers' => ['pea', 'cto']],
            ])
        );
    }
}
