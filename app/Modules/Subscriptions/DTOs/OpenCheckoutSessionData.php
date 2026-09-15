<?php

namespace App\Modules\Subscriptions\DTOs;

/**
 * A Stripe Checkout Session that can still be paid. `priceId` is null for a
 * session this app didn't tag (created before the tag existed, or elsewhere).
 */
readonly class OpenCheckoutSessionData
{
    public function __construct(
        public string $id,
        public string $url,
        public ?string $priceId,
    ) {}
}
