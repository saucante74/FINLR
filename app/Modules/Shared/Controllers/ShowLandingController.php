<?php

namespace App\Modules\Shared\Controllers;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The public marketing page served on "/". It carries no business logic: the
 * page only needs to know whether it can offer the login and sign-up calls to
 * action, exactly like the freemium calculator page it replaced on that URL.
 */
class ShowLandingController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Landing', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
