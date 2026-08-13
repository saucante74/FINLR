<?php

namespace App\Modules\FinancialTools\Controllers;

use App\Modules\FinancialTools\Support\FinancialSettings;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class ShowCalculatorController extends Controller
{
    /**
     * Display the calculator landing page.
     */
    public function __invoke(): Response
    {
        return Inertia::render('Calculator', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'financial' => FinancialSettings::fromConfig()->toArray(),
        ]);
    }
}
