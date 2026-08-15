<?php

namespace App\Modules\User\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\User\Actions\DeleteAccountAction;
use App\Modules\User\Requests\DeleteAccountRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class DeleteAccountController extends Controller
{
    public function __invoke(DeleteAccountRequest $request, DeleteAccountAction $action): RedirectResponse
    {
        $action->handle($request, $request->user());

        return Redirect::to('/');
    }
}
