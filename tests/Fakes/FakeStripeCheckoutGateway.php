<?php

namespace Tests\Fakes;

use App\Modules\Subscriptions\Contracts\StripeCheckoutGatewayInterface;
use App\Modules\Subscriptions\DTOs\CheckoutSessionRequestData;
use App\Modules\Subscriptions\DTOs\OpenCheckoutSessionData;
use App\Modules\Subscriptions\Enums\StripeSubscriptionStatus;
use App\Modules\User\Models\User;

/**
 * In-memory Stripe account: its state moves ahead of the local database
 * exactly like the real one does before a webhook is delivered.
 */
class FakeStripeCheckoutGateway implements StripeCheckoutGatewayInterface
{
    public const CUSTOMER_ID = 'cus_test_finlr';

    public int $customersCreated = 0;

    /**
     * Simulates a request that doesn't see a session created a moment ago
     * (e.g. two requests running in parallel without the lock).
     */
    public bool $hideOpenSessions = false;

    /** @var array<string, array{priceId: string, status: string}> */
    public array $sessions = [];

    /** @var list<string> */
    public array $subscriptionStatuses = [];

    /** @var array<string, string> idempotency key => session ID */
    private array $idempotencyKeys = [];

    public function ensureCustomer(User $user): string
    {
        if (! $user->hasStripeId()) {
            $user->forceFill(['stripe_id' => self::CUSTOMER_ID])->save();
            $this->customersCreated++;
        }

        return (string) $user->stripe_id;
    }

    public function hasSubscriptionInProgress(string $customerId): bool
    {
        foreach ($this->subscriptionStatuses as $status) {
            if (StripeSubscriptionStatus::blocksNewCheckoutFor($status)) {
                return true;
            }
        }

        return false;
    }

    public function openSessions(string $customerId): array
    {
        if ($this->hideOpenSessions) {
            return [];
        }

        $open = [];

        foreach (array_keys($this->sessions) as $id) {
            $session = $this->toOpenSession($id);

            if ($session !== null) {
                $open[] = $session;
            }
        }

        return $open;
    }

    public function expireSession(string $sessionId): void
    {
        $this->sessions[$sessionId]['status'] = 'expired';
    }

    public function createSession(CheckoutSessionRequestData $data): ?OpenCheckoutSessionData
    {
        // Stripe replays the original response for a known idempotency key.
        if (isset($this->idempotencyKeys[$data->idempotencyKey])) {
            return $this->toOpenSession($this->idempotencyKeys[$data->idempotencyKey]);
        }

        $id = 'cs_test_'.(count($this->sessions) + 1);
        $this->sessions[$id] = ['priceId' => $data->priceId, 'status' => 'open'];
        $this->idempotencyKeys[$data->idempotencyKey] = $id;

        return $this->toOpenSession($id);
    }

    /**
     * The customer pays on Stripe: the subscription exists there, the
     * webhook hasn't reached the app yet.
     */
    public function completeSession(string $sessionId): void
    {
        $this->sessions[$sessionId]['status'] = 'complete';
        $this->subscriptionStatuses[] = StripeSubscriptionStatus::ACTIVE->value;
    }

    public function activeSubscriptionCount(): int
    {
        return count(array_filter(
            $this->subscriptionStatuses,
            fn (string $status): bool => $status === StripeSubscriptionStatus::ACTIVE->value,
        ));
    }

    /**
     * @return list<string>
     */
    public function openSessionIds(): array
    {
        return array_keys(array_filter($this->sessions, fn (array $session): bool => $session['status'] === 'open'));
    }

    public static function urlFor(string $sessionId): string
    {
        return "https://checkout.stripe.test/{$sessionId}";
    }

    private function toOpenSession(string $id): ?OpenCheckoutSessionData
    {
        $session = $this->sessions[$id];

        if ($session['status'] !== 'open') {
            return null;
        }

        return new OpenCheckoutSessionData(id: $id, url: self::urlFor($id), priceId: $session['priceId']);
    }
}
