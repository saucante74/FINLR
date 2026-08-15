<?php

use App\Modules\Calculator\Controllers\CalculateFreeInvestmentController;
use App\Modules\Calculator\Controllers\ShowCalculatorController;
use App\Modules\Shared\Controllers\ShowDashboardController;
use App\Modules\User\Controllers\DeleteAccountController;
use App\Modules\User\Controllers\EditProfileController;
use App\Modules\User\Controllers\UpdateProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', ShowCalculatorController::class);
Route::post('/calculator/free', CalculateFreeInvestmentController::class)->name('calculator.free');

Route::get('/dashboard', ShowDashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', EditProfileController::class)->name('profile.edit');
    Route::patch('/profile', UpdateProfileController::class)->name('profile.update');
    Route::delete('/profile', DeleteAccountController::class)->name('profile.destroy');
});

require __DIR__.'/auth.php';
