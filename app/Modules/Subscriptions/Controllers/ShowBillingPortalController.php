<?php

namespace App\Modules\Subscriptions\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\Subscriptions\Actions\ResolveBillingPortalUrlAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShowBillingPortalController extends Controller
{
    public function __invoke(Request $request, ResolveBillingPortalUrlAction $action): Response
    {
        $user = $request->user();

        abort_if($user === null, 403);

        return Inertia::location($action->handle($user));
    }
}
