<?php

namespace App\Modules\User\Actions;

use App\Modules\User\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeleteAccountAction
{
    public function handle(Request $request, User $user): void
    {
        // Cancel at Stripe before anything else: if Stripe fails, the account
        // is kept rather than deleted while a customer keeps being billed.
        $subscription = $user->subscription(User::SUBSCRIPTION_TYPE);

        if ($subscription !== null && ! $subscription->ended()) {
            $subscription->cancelNow();
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
    }
}
