<?php

namespace App\Modules\Subscriptions\Services;

use App\Modules\Subscriptions\Contracts\StripeCheckoutGatewayInterface;
use App\Modules\Subscriptions\DTOs\CheckoutSessionRequestData;
use App\Modules\Subscriptions\DTOs\OpenCheckoutSessionData;
use App\Modules\Subscriptions\Enums\StripeSubscriptionStatus;
use App\Modules\User\Models\User;
use Laravel\Cashier\Cashier;
use Stripe\Checkout\Session;
use Stripe\StripeClient;

/**
 * Talks to Stripe directly instead of going through Cashier's
 * `newSubscription()->checkout()`: that builder can't forward request options,
 * so it can't carry an idempotency key. The session payload below mirrors
 * what `SubscriptionBuilder::checkout()` sends for the installed Stripe API
 * version ("dahlia": classic billing mode, `type`/`name` metadata), so
 * Cashier's webhook handler still stores the subscription under the right
 * type. Re-check it against Cashier whenever Cashier or stripe-php is upgraded.
 */
class StripeCheckoutGateway implements StripeCheckoutGatewayInterface
{
    private const PRICE_METADATA_KEY = 'finlr_price_id';

    private const LIST_LIMIT = 100;

    public function ensureCustomer(User $user): string
    {
        // Two first-ever checkouts racing each other would otherwise create
        // two Stripe customers, splitting the "already subscribed?" lookup.
        $idempotencyKey = 'finlr-customer-'.hash('sha256', implode('|', [
            $user->id,
            $user->created_at?->getTimestamp(),
            $user->name,
            $user->email,
        ]));

        return $user->createOrGetStripeCustomer([], ['idempotency_key' => $idempotencyKey])->id;
    }

    public function hasSubscriptionInProgress(string $customerId): bool
    {
        $subscriptions = $this->stripe()->subscriptions->all([
            'customer' => $customerId,
            'status' => 'all',
            'limit' => self::LIST_LIMIT,
        ]);

        foreach ($subscriptions->autoPagingIterator() as $subscription) {
            if (StripeSubscriptionStatus::blocksNewCheckoutFor($subscription->status)) {
                return true;
            }
        }

        return false;
    }

    public function openSessions(string $customerId): array
    {
        $sessions = $this->stripe()->checkout->sessions->all([
            'customer' => $customerId,
            'status' => Session::STATUS_OPEN,
            'limit' => self::LIST_LIMIT,
        ]);

        $open = [];

        foreach ($sessions->autoPagingIterator() as $session) {
            $data = $this->toOpenSession($session);

            if ($data !== null) {
                $open[] = $data;
            }
        }

        return $open;
    }

    public function expireSession(string $sessionId): void
    {
        $this->stripe()->checkout->sessions->expire($sessionId);
    }

    public function createSession(CheckoutSessionRequestData $data): ?OpenCheckoutSessionData
    {
        $session = $this->stripe()->checkout->sessions->create([
            'mode' => Session::MODE_SUBSCRIPTION,
            'customer' => $data->customerId,
            'line_items' => [['price' => $data->priceId, 'quantity' => 1]],
            'subscription_data' => [
                'billing_mode' => ['type' => 'classic'],
                'metadata' => [
                    'name' => User::SUBSCRIPTION_TYPE,
                    'type' => User::SUBSCRIPTION_TYPE,
                    'is_on_session_checkout' => 'true',
                ],
            ],
            'metadata' => [self::PRICE_METADATA_KEY => $data->priceId],
            'success_url' => $data->successUrl,
            'cancel_url' => $data->cancelUrl,
        ], ['idempotency_key' => $data->idempotencyKey]);

        return $this->toOpenSession($session);
    }

    private function toOpenSession(Session $session): ?OpenCheckoutSessionData
    {
        if ($session->status !== Session::STATUS_OPEN || $session->url === null) {
            return null;
        }

        $priceId = $session->metadata[self::PRICE_METADATA_KEY] ?? null;

        return new OpenCheckoutSessionData(
            id: $session->id,
            url: $session->url,
            priceId: is_string($priceId) ? $priceId : null,
        );
    }

    private function stripe(): StripeClient
    {
        return Cashier::stripe();
    }
}
