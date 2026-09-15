<?php

namespace Tests\Feature\Subscriptions;

use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Guards around the billing controllers. The Stripe API calls themselves
 * (creating a Checkout session or a portal session) are deliberately not
 * exercised here — they are covered by the manual stripe-cli checklist.
 */
class BillingControllersTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_guest_cannot_start_a_checkout(): void
    {
        $this->post(route('billing.checkout'), ['period' => 'monthly'])
            ->assertRedirect(route('login'));
    }

    public function test_an_unverified_user_cannot_start_a_checkout(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->post(route('billing.checkout'), ['period' => 'monthly'])
            ->assertRedirect(route('verification.notice'));
    }

    public function test_the_billing_period_is_required(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('billing.checkout'))
            ->assertSessionHasErrors('period');
    }

    public function test_an_unknown_billing_period_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('billing.checkout'), ['period' => 'weekly'])
            ->assertSessionHasErrors('period');
    }

    public function test_an_already_subscribed_user_is_sent_to_the_billing_portal_instead_of_a_second_checkout(): void
    {
        $user = User::factory()->premium()->create();

        $this->actingAs($user)
            ->withHeader('X-Inertia', 'true')
            ->post(route('billing.checkout'), ['period' => 'yearly'])
            ->assertStatus(409)
            ->assertHeader('X-Inertia-Location', route('billing.portal'));

        $this->assertCount(1, $user->subscriptions()->get());
    }

    public function test_starting_a_checkout_is_rate_limited_per_user(): void
    {
        $user = User::factory()->premium()->create();

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->actingAs($user)->post(route('billing.checkout'), ['period' => 'monthly']);
        }

        $this->actingAs($user)
            ->post(route('billing.checkout'), ['period' => 'monthly'])
            ->assertTooManyRequests();
    }

    public function test_returning_from_checkout_redirects_to_the_dashboard_with_a_pending_activation_status(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('billing.checkout.success'))
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas('status', 'premium-checkout-completed');

        $this->actingAs($user)
            ->withSession(['status' => 'premium-checkout-completed'])
            ->get(route('dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('status', 'premium-checkout-completed')->etc());
    }

    public function test_a_guest_cannot_open_the_billing_portal(): void
    {
        $this->get(route('billing.portal'))->assertRedirect(route('login'));
    }

    public function test_a_user_who_never_checked_out_is_sent_back_to_the_dashboard_instead_of_the_portal(): void
    {
        $user = User::factory()->create();

        // Reached through a plain link (full page visit), not an Inertia XHR.
        $this->actingAs($user)
            ->get(route('billing.portal'))
            ->assertRedirect(route('dashboard'));
    }

    public function test_deleting_an_account_without_subscription_never_calls_stripe(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->delete(route('settings.destroy'), ['password' => 'password'])
            ->assertRedirect('/');

        $this->assertModelMissing($user);
    }

    public function test_deleting_an_account_with_an_already_ended_subscription_never_calls_stripe(): void
    {
        $user = User::factory()->create();
        $user->subscriptions()->create([
            'type' => User::SUBSCRIPTION_TYPE,
            'stripe_id' => 'sub_test_ended',
            'stripe_status' => 'canceled',
            'ends_at' => now()->subDay(),
        ]);

        $this->actingAs($user)
            ->delete(route('settings.destroy'), ['password' => 'password'])
            ->assertRedirect('/');

        $this->assertModelMissing($user);
    }
}
