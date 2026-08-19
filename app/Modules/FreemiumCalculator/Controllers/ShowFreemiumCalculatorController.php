<?php

namespace App\Modules\FreemiumCalculator\Controllers;

use App\Modules\Shared\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class ShowFreemiumCalculatorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('FreemiumCalculator', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
