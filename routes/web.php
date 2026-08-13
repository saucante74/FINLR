<?php

use App\Modules\FinancialTools\Controllers\ShowCalculatorController;
use App\Modules\Shared\Controllers\DeleteAccountController;
use App\Modules\Shared\Controllers\EditProfileController;
use App\Modules\Shared\Controllers\ShowDashboardController;
use App\Modules\Shared\Controllers\UpdateProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', ShowCalculatorController::class);

Route::get('/dashboard', ShowDashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', EditProfileController::class)->name('profile.edit');
    Route::patch('/profile', UpdateProfileController::class)->name('profile.update');
    Route::delete('/profile', DeleteAccountController::class)->name('profile.destroy');
});

require __DIR__.'/auth.php';
