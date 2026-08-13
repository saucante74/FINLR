<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\SendEmailVerificationNotificationAction;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SendEmailVerificationNotificationController extends Controller
{
    public function __invoke(Request $request, SendEmailVerificationNotificationAction $action): RedirectResponse
    {
        if (! $action->handle($request->user())) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        return back()->with('status', 'verification-link-sent');
    }
}
