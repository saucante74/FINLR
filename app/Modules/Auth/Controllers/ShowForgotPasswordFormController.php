<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Shared\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShowForgotPasswordFormController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }
}
