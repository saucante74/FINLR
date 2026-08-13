<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\AuthenticateSessionAction;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class StoreSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function __invoke(LoginRequest $request, AuthenticateSessionAction $action): RedirectResponse
    {
        $action->handle($request);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
