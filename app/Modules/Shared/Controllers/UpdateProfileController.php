<?php

namespace App\Modules\Shared\Controllers;

use App\Modules\Shared\Actions\UpdateProfileAction;
use App\Modules\Shared\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class UpdateProfileController extends Controller
{
    public function __invoke(ProfileUpdateRequest $request, UpdateProfileAction $action): RedirectResponse
    {
        $action->handle($request->user(), $request->validated());

        return Redirect::route('profile.edit');
    }
}
