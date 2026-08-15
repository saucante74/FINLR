<?php

namespace App\Modules\Calculator\Controllers;

use App\Modules\Calculator\Support\CalculatorPageProps;
use App\Modules\Shared\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShowCalculatorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Calculator', CalculatorPageProps::base());
    }
}
