<?php

namespace Tests\Feature;

use App\Modules\Subscriptions\Enums\BillingPeriod;
use App\Modules\Subscriptions\Enums\Permission;
use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Laravel\Cashier\Subscription;
use Tests\TestCase;

class SubscriptionPermissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_without_subscription_is_on_the_free_plan_with_create_project_only(): void
    {
        $user = User::factory()->create();

        $this->assertSame(Plan::FREE, $user->plan());
        $this->assertTrue(Gate::forUser($user)->allows(Permission::CREATE_PROJECT->value));
        $this->assertFalse(Gate::forUser($user)->allows(Permission::EXPORT_REPORTS->value));
        $this->assertFalse(Gate::forUser($user)->allows(Permission::ADVANCED_CALCULATOR->value));
    }

    public function test_an_active_monthly_subscription_grants_premium_and_every_permission(): void
    {
        $user = User::factory()->premium()->create();

        $this->assertSame(Plan::PREMIUM, $user->plan());
        $this->assertTrue(Gate::forUser($user)->allows(Permission::CREATE_PROJECT->value));
        $this->assertTrue(Gate::forUser($user)->allows(Permission::EXPORT_REPORTS->value));
        $this->assertTrue(Gate::forUser($user)->allows(Permission::ADVANCED_CALCULATOR->value));
    }

    public function test_an_active_yearly_subscription_grants_premium_with_the_yearly_price(): void
    {
        config(['services.stripe.premium_prices' => ['monthly' => 'price_monthly', 'yearly' => 'price_yearly']]);

        $user = User::factory()->premium(BillingPeriod::YEARLY)->create();

        $this->assertSame(Plan::PREMIUM, $user->plan());
        $this->assertTrue($user->subscribed(User::SUBSCRIPTION_TYPE, 'price_yearly'));
        $this->assertFalse($user->subscribed(User::SUBSCRIPTION_TYPE, 'price_monthly'));
    }

    public function test_a_past_due_subscription_immediately_loses_premium_access(): void
    {
        $user = $this->userWithSubscription(Subscription::factory()->pastDue());

        $this->assertSame(Plan::FREE, $user->plan());
        $this->assertFalse(Gate::forUser($user)->allows(Permission::ADVANCED_CALCULATOR->value));
    }

    public function test_a_canceled_subscription_keeps_premium_until_the_end_of_its_grace_period(): void
    {
        $user = $this->userWithSubscription(
            Subscription::factory()->active()->state(['ends_at' => now()->addDays(10)]),
        );

        $this->assertSame(Plan::PREMIUM, $user->plan());
        $this->assertTrue(Gate::forUser($user)->allows(Permission::ADVANCED_CALCULATOR->value));
    }

    public function test_an_ended_subscription_is_back_on_the_free_plan(): void
    {
        $user = $this->userWithSubscription(Subscription::factory()->canceled()->state(['ends_at' => now()->subDay()]));

        $this->assertSame(Plan::FREE, $user->plan());
        $this->assertFalse(Gate::forUser($user)->allows(Permission::ADVANCED_CALCULATOR->value));
    }

    public function test_an_incomplete_subscription_does_not_grant_premium(): void
    {
        $user = $this->userWithSubscription(Subscription::factory()->incomplete());

        $this->assertSame(Plan::FREE, $user->plan());
    }

    public function test_user_has_permission_helper_matches_the_gates(): void
    {
        $free = User::factory()->create();
        $premium = User::factory()->premium()->create();

        $this->assertTrue($free->hasPermission(Permission::CREATE_PROJECT));
        $this->assertFalse($free->hasPermission(Permission::EXPORT_REPORTS));
        $this->assertTrue($premium->hasPermission(Permission::EXPORT_REPORTS));
        $this->assertTrue($premium->hasPermission(Permission::ADVANCED_CALCULATOR));
    }

    public function test_plan_grants_the_correct_permissions(): void
    {
        $this->assertTrue(Plan::FREE->grants(Permission::CREATE_PROJECT));
        $this->assertFalse(Plan::FREE->grants(Permission::EXPORT_REPORTS));
        $this->assertFalse(Plan::FREE->grants(Permission::ADVANCED_CALCULATOR));

        foreach (Permission::cases() as $permission) {
            $this->assertTrue(Plan::PREMIUM->grants($permission));
        }
    }

    public function test_billing_periods_resolve_their_price_id_from_config(): void
    {
        config(['services.stripe.premium_prices' => ['monthly' => 'price_monthly', 'yearly' => 'price_yearly']]);

        $this->assertSame('price_monthly', BillingPeriod::MONTHLY->priceId());
        $this->assertSame('price_yearly', BillingPeriod::YEARLY->priceId());
    }

    public function test_free_and_premium_users_share_the_correct_plan_and_permissions_via_inertia(): void
    {
        $free = User::factory()->create();
        $premium = User::factory()->premium()->create();

        $this->actingAs($free)
            ->get('/dashboard')
            ->assertInertia(fn ($page) => $page
                ->where('auth.plan', 'free')
                ->where('auth.permissions', ['create_project'])
            );

        $this->actingAs($premium)
            ->get('/dashboard')
            ->assertInertia(fn ($page) => $page
                ->where('auth.plan', 'premium')
                ->where('auth.permissions', [
                    'export_reports',
                    'create_project',
                    'advanced_calculator',
                ])
            );
    }

    public function test_a_past_due_user_is_refused_a_premium_route(): void
    {
        $user = $this->userWithSubscription(Subscription::factory()->pastDue());

        $this->actingAs($user)->get(route('simulators.fire.show'))->assertForbidden();
    }

    /**
     * @param  Factory<Subscription>  $subscription
     */
    private function userWithSubscription(Factory $subscription): User
    {
        return User::factory()
            ->has($subscription->state(['type' => User::SUBSCRIPTION_TYPE]), 'subscriptions')
            ->create();
    }
}
