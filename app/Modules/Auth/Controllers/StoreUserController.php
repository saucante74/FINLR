<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\RegisterUserAction;
use App\Modules\Auth\Requests\RegisterUserRequest;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class StoreUserController extends Controller
{
    public function __invoke(RegisterUserRequest $request, RegisterUserAction $action): RedirectResponse
    {
        $action->handle($request->validated());

        return redirect(route('dashboard', absolute: false));
    }
}
