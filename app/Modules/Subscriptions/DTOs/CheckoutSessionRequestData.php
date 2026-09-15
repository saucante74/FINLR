<?php

namespace App\Modules\Subscriptions\DTOs;

readonly class CheckoutSessionRequestData
{
    public function __construct(
        public string $customerId,
        public string $priceId,
        public string $successUrl,
        public string $cancelUrl,
        public string $idempotencyKey,
    ) {}
}
