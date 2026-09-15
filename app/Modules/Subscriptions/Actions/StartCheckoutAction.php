<?php

namespace App\Modules\Subscriptions\Actions;

use App\Modules\Subscriptions\Contracts\StripeCheckoutGatewayInterface;
use App\Modules\Subscriptions\DTOs\CheckoutSessionRequestData;
use App\Modules\Subscriptions\Enums\BillingPeriod;
use App\Modules\User\Models\User;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Support\Facades\Cache;

/**
 * Returns where to send the user: a Stripe Checkout page, or the billing
 * portal when a subscription already exists. The local `subscriptions` table
 * only catches up once Stripe's webhook lands, so it can't be the only guard
 * against a second, parallel subscription:
 *
 *  1. one checkout at a time per user (cache lock), so a burst of requests
 *     is handled sequentially instead of each seeing "nothing yet";
 *  2. Stripe itself is asked whether a subscription is active or still
 *     processing, even when the local table doesn't know about it yet;
 *  3. an already open Checkout Session for the same price is reused, and any
 *     other one is expired, so at most one payable session exists;
 *  4. the creation carries an idempotency key, so a burst that still slips
 *     through (e.g. a lock lost with the cache) is merged by Stripe.
 */
class StartCheckoutAction
{
    private const LOCK_SECONDS = 30;

    private const LOCK_WAIT_SECONDS = 10;

    private const IDEMPOTENCY_WINDOW_SECONDS = 60;

    public function __construct(private StripeCheckoutGatewayInterface $gateway) {}

    public function handle(User $user, BillingPeriod $period): string
    {
        try {
            return Cache::lock("billing-checkout:user:{$user->id}", self::LOCK_SECONDS)
                ->block(self::LOCK_WAIT_SECONDS, fn (): string => $this->resolve($user, $period));
        } catch (LockTimeoutException) {
            // Another checkout for this user is still talking to Stripe:
            // never start a parallel one.
            return route('dashboard');
        }
    }

    private function resolve(User $user, BillingPeriod $period): string
    {
        // A request that waited for the lock must see what the previous one
        // stored (Stripe customer ID, subscriptions synced meanwhile).
        $user->refresh();

        if ($user->subscribed(User::SUBSCRIPTION_TYPE)) {
            return route('billing.portal');
        }

        $customerId = $this->gateway->ensureCustomer($user);

        if ($this->gateway->hasSubscriptionInProgress($customerId)) {
            return route('billing.portal');
        }

        $priceId = $period->priceId();
        $reusable = null;
        $expiredSessionIds = [];

        foreach ($this->gateway->openSessions($customerId) as $session) {
            if ($reusable === null && $session->priceId === $priceId) {
                $reusable = $session;

                continue;
            }

            // A second payable session (other period, untagged, or a leftover
            // duplicate) could be paid in another tab: close it.
            $this->gateway->expireSession($session->id);
            $expiredSessionIds[] = $session->id;
        }

        if ($reusable !== null) {
            return $reusable->url;
        }

        $session = $this->gateway->createSession(new CheckoutSessionRequestData(
            customerId: $customerId,
            priceId: $priceId,
            successUrl: route('billing.checkout.success'),
            cancelUrl: route('dashboard'),
            idempotencyKey: $this->idempotencyKey($user, $customerId, $priceId, $expiredSessionIds),
        ));

        return $session->url ?? route('dashboard');
    }

    /**
     * Identical for every request of the same burst (same user, customer,
     * price, minute), so Stripe answers duplicates with the first session.
     * The sessions just expired are part of it: switching monthly → yearly →
     * monthly within a minute must not replay the monthly session expired in
     * between.
     *
     * @param  list<string>  $expiredSessionIds
     */
    private function idempotencyKey(User $user, string $customerId, string $priceId, array $expiredSessionIds): string
    {
        return 'finlr-checkout-'.hash('sha256', implode('|', [
            $user->id,
            $customerId,
            $priceId,
            intdiv(now()->getTimestamp(), self::IDEMPOTENCY_WINDOW_SECONDS),
            ...$expiredSessionIds,
        ]));
    }
}
