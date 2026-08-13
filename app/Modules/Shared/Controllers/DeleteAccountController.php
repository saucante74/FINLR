<?php

namespace App\Modules\Shared\Controllers;

use App\Modules\Shared\Actions\DeleteAccountAction;
use App\Modules\Shared\Requests\DeleteAccountRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class DeleteAccountController extends Controller
{
    /**
     * Delete the user's account.
     */
    public function __invoke(DeleteAccountRequest $request, DeleteAccountAction $action): RedirectResponse
    {
        $action->handle($request, $request->user());

        return Redirect::to('/');
    }
}
