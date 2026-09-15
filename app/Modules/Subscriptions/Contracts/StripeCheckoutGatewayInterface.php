<?php

namespace App\Modules\Subscriptions\Contracts;

use App\Modules\Subscriptions\DTOs\CheckoutSessionRequestData;
use App\Modules\Subscriptions\DTOs\OpenCheckoutSessionData;
use App\Modules\User\Models\User;

/**
 * The Stripe calls behind a checkout, read from Stripe itself rather than
 * from the local tables that webhooks fill in later.
 */
interface StripeCheckoutGatewayInterface
{
    /**
     * Returns the user's Stripe customer ID, creating the customer if needed.
     */
    public function ensureCustomer(User $user): string;

    /**
     * Whether Stripe already holds a subscription for this customer that is
     * active or still being processed, whatever the local database says.
     */
    public function hasSubscriptionInProgress(string $customerId): bool;

    /**
     * @return list<OpenCheckoutSessionData>
     */
    public function openSessions(string $customerId): array;

    public function expireSession(string $sessionId): void;

    /**
     * Null when Stripe answers with a session that can no longer be paid —
     * an idempotent replay of a session completed or expired since.
     */
    public function createSession(CheckoutSessionRequestData $data): ?OpenCheckoutSessionData;
}
