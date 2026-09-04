<?php

namespace App\Modules\Shared\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ShowSimulatorsController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('simulator/Simulators');
    }
}
