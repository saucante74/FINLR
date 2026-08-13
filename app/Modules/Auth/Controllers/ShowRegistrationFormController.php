<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Shared\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShowRegistrationFormController extends Controller
{
    /**
     * Display the registration view.
     */
    public function __invoke(): Response
    {
        return Inertia::render('Auth/Register');
    }
}
