<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\VerifyEmailAction;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyUserEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request, VerifyEmailAction $action): RedirectResponse
    {
        $action->handle($request->user());

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
