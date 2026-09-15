<?php

namespace Tests\Unit\Subscriptions;

use App\Modules\Subscriptions\Enums\StripeSubscriptionStatus;
use PHPUnit\Framework\TestCase;

class StripeSubscriptionStatusTest extends TestCase
{
    public function test_only_subscriptions_that_can_never_bill_again_allow_a_new_checkout(): void
    {
        foreach (StripeSubscriptionStatus::cases() as $status) {
            $expected = ! in_array($status, [StripeSubscriptionStatus::CANCELED, StripeSubscriptionStatus::INCOMPLETE_EXPIRED], true);

            $this->assertSame($expected, $status->blocksNewCheckout(), $status->value);
        }
    }

    public function test_a_status_unknown_to_the_app_blocks_a_new_checkout(): void
    {
        $this->assertTrue(StripeSubscriptionStatus::blocksNewCheckoutFor('some_future_status'));
    }
}
