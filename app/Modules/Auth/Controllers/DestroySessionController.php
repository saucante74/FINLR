<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Actions\DestroySessionAction;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroySessionController extends Controller
{
    /**
     * Destroy an authenticated session.
     */
    public function __invoke(Request $request, DestroySessionAction $action): RedirectResponse
    {
        $action->handle($request);

        return redirect('/');
    }
}
