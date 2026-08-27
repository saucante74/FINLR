<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\UpdatePasswordAction;
use App\Modules\Auth\Requests\UpdatePasswordRequest;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class UpdatePasswordController extends Controller
{
    public function __invoke(UpdatePasswordRequest $request, UpdatePasswordAction $action): RedirectResponse
    {
        $action->handle($request->user(), $request->validated('password'));

        return back()->with('status', 'password-updated');
    }
}
