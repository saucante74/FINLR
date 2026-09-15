<?php

namespace App\Modules\Subscriptions\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\Subscriptions\Actions\StartCheckoutAction;
use App\Modules\Subscriptions\Requests\StartCheckoutRequest;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class StartCheckoutController extends Controller
{
    public function __invoke(StartCheckoutRequest $request, StartCheckoutAction $action): Response
    {
        $user = $request->user();

        abort_if($user === null, 403);

        // Stripe Checkout lives on another domain: a plain 302 can't be
        // followed by Inertia's XHR visit, Inertia::location() forces a full
        // page visit instead.
        return Inertia::location($action->handle($user, $request->period()));
    }
}
