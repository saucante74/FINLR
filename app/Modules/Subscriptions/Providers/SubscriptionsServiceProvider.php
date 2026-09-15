<?php

namespace App\Modules\Subscriptions\Providers;

use App\Modules\Subscriptions\Contracts\StripeCheckoutGatewayInterface;
use App\Modules\Subscriptions\Services\StripeCheckoutGateway;
use Illuminate\Support\ServiceProvider;

class SubscriptionsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(StripeCheckoutGatewayInterface::class, StripeCheckoutGateway::class);
    }
}
