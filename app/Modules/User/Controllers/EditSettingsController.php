<?php

namespace App\Modules\User\Controllers;

use App\Modules\Shared\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditSettingsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Settings/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'memberSince' => $user->created_at->toISOString(),
            'profileUpdatedAt' => $user->updated_at->toISOString(),
            'scenariosCount' => $user->scenarios()->count(),
        ]);
    }
}
