<?php

namespace App\Modules\Calculator\Support;

use Illuminate\Support\Facades\Route;

class CalculatorPageProps
{
    /**
     * @return array<string, mixed>
     */
    public static function base(): array
    {
        return [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'financial' => FinancialSettings::fromConfig()->toArray(),
        ];
    }
}
