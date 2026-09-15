<?php

namespace Tests\Feature\Subscriptions;

use App\Modules\Subscriptions\Contracts\StripeCheckoutGatewayInterface;
use App\Modules\Subscriptions\Enums\StripeSubscriptionStatus;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\Fakes\FakeStripeCheckoutGateway;
use Tests\TestCase;

/**
 * Regression: a user clicked "Go premium" several times while Stripe's
 * webhook hadn't confirmed the first subscription yet, and ended up with
 * three active subscriptions. Stripe is replaced by an in-memory fake whose
 * state runs ahead of the database, like the real account before a webhook.
 */
class DuplicateCheckoutPreventionTest extends TestCase
{
    use RefreshDatabase;

    private const MONTHLY_PRICE = 'price_test_monthly';

    private const YEARLY_PRICE = 'price_test_yearly';

    private FakeStripeCheckoutGateway $stripe;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.stripe.premium_prices.monthly' => self::MONTHLY_PRICE,
            'services.stripe.premium_prices.yearly' => self::YEARLY_PRICE,
            'cashier.webhook.secret' => null,
        ]);

        $this->stripe = new FakeStripeCheckoutGateway;
        $this->app->instance(StripeCheckoutGatewayInterface::class, $this->stripe);
    }

    public function test_two_close_checkouts_before_the_webhook_result_in_a_single_active_subscription(): void
    {
        $user = User::factory()->create();

        // Two clicks before anything is confirmed in the database.
        $this->checkout($user)->assertHeader('X-Inertia-Location', FakeStripeCheckoutGateway::urlFor('cs_test_1'));
        $this->checkout($user)->assertHeader('X-Inertia-Location', FakeStripeCheckoutGateway::urlFor('cs_test_1'));

        $this->assertSame(1, $this->stripe->customersCreated);
        $this->assertCount(1, $this->stripe->sessions);
        $this->assertDatabaseCount('subscriptions', 0);

        // The first checkout is paid on Stripe; the webhook is still in flight.
        $this->stripe->completeSession('cs_test_1');

        $this->checkout($user)->assertHeader('X-Inertia-Location', route('billing.portal'));
        $this->assertCount(1, $this->stripe->sessions);
        $this->assertDatabaseCount('subscriptions', 0);

        // The webhook finally lands.
        $this->deliverWebhook('customer.subscription.created');

        $this->checkout($user)->assertHeader('X-Inertia-Location', route('billing.portal'));

        $this->assertSame(1, $this->stripe->activeSubscriptionCount());
        $this->assertCount(1, $this->stripe->sessions);
        $this->assertSame(1, $user->subscriptions()->where('stripe_status', 'active')->count());
    }

    public function test_a_burst_that_misses_the_open_session_is_merged_by_the_idempotency_key(): void
    {
        $user = User::factory()->create();
        $this->stripe->hideOpenSessions = true;

        $this->checkout($user)->assertHeader('X-Inertia-Location', FakeStripeCheckoutGateway::urlFor('cs_test_1'));
        $this->checkout($user)->assertHeader('X-Inertia-Location', FakeStripeCheckoutGateway::urlFor('cs_test_1'));

        $this->assertCount(1, $this->stripe->sessions);
    }

    public function test_a_subscription_known_only_to_stripe_blocks_a_new_checkout(): void
    {
        $user = User::factory()->create(['stripe_id' => FakeStripeCheckoutGateway::CUSTOMER_ID]);
        $this->stripe->subscriptionStatuses = [StripeSubscriptionStatus::ACTIVE->value];

        $this->checkout($user)->assertHeader('X-Inertia-Location', route('billing.portal'));

        $this->assertCount(0, $this->stripe->sessions);
    }

    public function test_a_payment_still_processing_on_stripe_blocks_a_new_checkout(): void
    {
        $user = User::factory()->create(['stripe_id' => FakeStripeCheckoutGateway::CUSTOMER_ID]);
        $this->stripe->subscriptionStatuses = [StripeSubscriptionStatus::INCOMPLETE->value];

        $this->checkout($user)->assertHeader('X-Inertia-Location', route('billing.portal'));

        $this->assertCount(0, $this->stripe->sessions);
    }

    public function test_an_ended_subscription_on_stripe_does_not_block_a_new_checkout(): void
    {
        $user = User::factory()->create(['stripe_id' => FakeStripeCheckoutGateway::CUSTOMER_ID]);
        $this->stripe->subscriptionStatuses = [
            StripeSubscriptionStatus::CANCELED->value,
            StripeSubscriptionStatus::INCOMPLETE_EXPIRED->value,
        ];

        $this->checkout($user)->assertHeader('X-Inertia-Location', FakeStripeCheckoutGateway::urlFor('cs_test_1'));
    }

    public function test_switching_period_leaves_only_one_payable_session(): void
    {
        $user = User::factory()->create();

        $this->checkout($user, 'monthly');
        $this->checkout($user, 'yearly')->assertHeader('X-Inertia-Location', FakeStripeCheckoutGateway::urlFor('cs_test_2'));

        $this->assertSame(['cs_test_2'], $this->stripe->openSessionIds());
    }

    public function test_switching_back_within_the_idempotency_window_never_replays_an_expired_session(): void
    {
        $user = User::factory()->create();

        $this->checkout($user, 'monthly');
        $this->checkout($user, 'yearly');
        $this->checkout($user, 'monthly')->assertHeader('X-Inertia-Location', FakeStripeCheckoutGateway::urlFor('cs_test_3'));

        $this->assertSame(['cs_test_3'], $this->stripe->openSessionIds());
    }

    /**
     * @return TestResponse<Response>
     */
    private function checkout(User $user, string $period = 'monthly'): TestResponse
    {
        return $this->actingAs($user)
            ->withHeader('X-Inertia', 'true')
            ->post(route('billing.checkout'), ['period' => $period])
            ->assertStatus(409);
    }

    private function deliverWebhook(string $fixture): void
    {
        $json = (string) file_get_contents(base_path("tests/Fixtures/Stripe/{$fixture}.json"));

        $this->call('POST', route('cashier.webhook'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], str_replace('__CUSTOMER__', FakeStripeCheckoutGateway::CUSTOMER_ID, $json))->assertOk();
    }
}
