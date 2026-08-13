<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\ResetPasswordAction;
use App\Modules\Auth\Requests\NewPasswordRequest;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class ResetPasswordController extends Controller
{
    /**
     * Handle an incoming new password request.
     */
    public function __invoke(NewPasswordRequest $request, ResetPasswordAction $action): RedirectResponse
    {
        $status = $action->handle($request->validated());

        return redirect()->route('login')->with('status', __($status));
    }
}
