<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\ConfirmPasswordAction;
use App\Modules\Auth\Requests\ConfirmPasswordRequest;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class StoreConfirmedPasswordController extends Controller
{
    public function __invoke(ConfirmPasswordRequest $request, ConfirmPasswordAction $action): RedirectResponse
    {
        $action->handle($request->user(), $request->validated('password'));

        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
