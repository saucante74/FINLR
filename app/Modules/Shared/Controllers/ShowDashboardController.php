<?php

namespace App\Modules\Shared\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ShowDashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Dashboard');
    }
}
