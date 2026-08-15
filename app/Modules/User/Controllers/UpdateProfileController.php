<?php

namespace App\Modules\User\Controllers;

use App\Modules\Shared\Controllers\Controller;
use App\Modules\User\Actions\UpdateProfileAction;
use App\Modules\User\DTOs\ProfileUpdateData;
use App\Modules\User\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class UpdateProfileController extends Controller
{
    public function __invoke(ProfileUpdateRequest $request, UpdateProfileAction $action): RedirectResponse
    {
        $action->handle($request->user(), ProfileUpdateData::fromRequest($request));

        return Redirect::route('profile.edit');
    }
}
