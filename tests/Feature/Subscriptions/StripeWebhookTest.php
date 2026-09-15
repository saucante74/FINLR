<?php

namespace Tests\Feature\Subscriptions;

use App\Modules\Subscriptions\Enums\Plan;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

/**
 * Exercises the project's wiring around Cashier's native webhook
 * (useCustomerModel, route path, CSRF, derived plan) with recorded Stripe
 * event fixtures — never Cashier's internals, never the network.
 */
class StripeWebhookTest extends TestCase
{
    use RefreshDatabase;

    private const CUSTOMER_ID = 'cus_test_finlr';

    protected function setUp(): void
    {
        parent::setUp();

        // Signature verification only applies when a secret is configured;
        // it is covered on its own by the two dedicated tests below.
        config(['cashier.webhook.secret' => null]);
    }

    public function test_the_webhook_is_served_by_cashier_on_the_stripe_path(): void
    {
        $this->assertSame(url('/stripe/webhook'), route('cashier.webhook'));
    }

    public function test_a_subscription_created_event_makes_the_customer_premium(): void
    {
        $user = User::factory()->create(['stripe_id' => self::CUSTOMER_ID]);

        $this->postEvent('customer.subscription.created')->assertOk();

        $user->refresh();
        $this->assertSame(Plan::PREMIUM, $user->plan());
        $this->assertTrue($user->subscribed(User::SUBSCRIPTION_TYPE, 'price_test_monthly'));
    }

    public function test_a_subscription_updated_to_past_due_removes_premium_access(): void
    {
        $user = User::factory()->create(['stripe_id' => self::CUSTOMER_ID]);
        $this->postEvent('customer.subscription.created')->assertOk();

        $this->postEvent('customer.subscription.updated.past_due')->assertOk();

        $user->refresh();
        $this->assertSame(Plan::FREE, $user->plan());
    }

    public function test_a_subscription_deleted_event_returns_the_customer_to_free(): void
    {
        $user = User::factory()->create(['stripe_id' => self::CUSTOMER_ID]);
        $this->postEvent('customer.subscription.created')->assertOk();

        $this->postEvent('customer.subscription.deleted')->assertOk();

        $user->refresh();
        $this->assertSame(Plan::FREE, $user->plan());
    }

    public function test_an_event_for_an_unknown_customer_is_acknowledged_without_side_effects(): void
    {
        $this->postEvent('customer.subscription.created')->assertOk();

        $this->assertDatabaseCount('subscriptions', 0);
    }

    public function test_a_correctly_signed_event_is_accepted(): void
    {
        config(['cashier.webhook.secret' => 'whsec_test_secret']);
        User::factory()->create(['stripe_id' => self::CUSTOMER_ID]);
        $payload = $this->fixture('customer.subscription.created');
        $timestamp = time();
        $signature = hash_hmac('sha256', "{$timestamp}.{$payload}", 'whsec_test_secret');

        $this->call('POST', route('cashier.webhook'), [], [], [], [
            'HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1={$signature}",
            'CONTENT_TYPE' => 'application/json',
        ], $payload)->assertOk();

        $this->assertDatabaseCount('subscriptions', 1);
    }

    public function test_an_event_with_an_invalid_signature_is_rejected(): void
    {
        config(['cashier.webhook.secret' => 'whsec_test_secret']);
        User::factory()->create(['stripe_id' => self::CUSTOMER_ID]);

        $this->call('POST', route('cashier.webhook'), [], [], [], [
            'HTTP_STRIPE_SIGNATURE' => 't='.time().',v1=forged',
            'CONTENT_TYPE' => 'application/json',
        ], $this->fixture('customer.subscription.created'))->assertForbidden();

        $this->assertDatabaseCount('subscriptions', 0);
    }

    /**
     * @return TestResponse<Response>
     */
    private function postEvent(string $name): TestResponse
    {
        // Plain POST with no CSRF token or session: proves Stripe can reach
        // the route exactly as it would in production.
        return $this->call('POST', route('cashier.webhook'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], $this->fixture($name));
    }

    private function fixture(string $name): string
    {
        $json = (string) file_get_contents(base_path("tests/Fixtures/Stripe/{$name}.json"));

        return str_replace('__CUSTOMER__', self::CUSTOMER_ID, $json);
    }
}
