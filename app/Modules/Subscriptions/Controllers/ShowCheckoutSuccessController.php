<?php

namespace App\Modules\Subscriptions\Controllers;

use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class ShowCheckoutSuccessController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        // "Activation pending", not "you're premium": the subscription only
        // exists once Stripe's webhook reaches Cashier, which can land after
        // this redirect.
        return redirect()->route('dashboard')->with('status', 'premium-checkout-completed');
    }
}
