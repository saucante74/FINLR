<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Shared\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShowConfirmPasswordFormController extends Controller
{
    /**
     * Show the confirm password view.
     */
    public function __invoke(): Response
    {
        return Inertia::render('Auth/ConfirmPassword');
    }
}
