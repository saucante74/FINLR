<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\SendPasswordResetLinkAction;
use App\Modules\Auth\Requests\PasswordResetLinkRequest;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class SendPasswordResetLinkController extends Controller
{
    public function __invoke(PasswordResetLinkRequest $request, SendPasswordResetLinkAction $action): RedirectResponse
    {
        $status = $action->handle($request->validated());

        return back()->with('status', __($status));
    }
}
