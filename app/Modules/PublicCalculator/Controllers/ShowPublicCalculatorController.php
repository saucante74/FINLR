<?php

namespace App\Modules\PublicCalculator\Controllers;

use App\Modules\Shared\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class ShowPublicCalculatorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('PublicCalculator', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
