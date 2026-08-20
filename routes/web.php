<?php

use App\Modules\FreemiumCalculator\Controllers\ShowFreemiumCalculatorController;
use App\Modules\Scenarios\Controllers\ShowScenarioController;
use App\Modules\Shared\Controllers\ShowDashboardController;
use App\Modules\SingleEnvelopeSimulator\Controllers\RunSingleEnvelopeSimulationController;
use App\Modules\User\Controllers\DeleteAccountController;
use App\Modules\User\Controllers\EditProfileController;
use App\Modules\User\Controllers\UpdateProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', ShowFreemiumCalculatorController::class)->name('calculator.freemium');

Route::get('/dashboard', ShowDashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', EditProfileController::class)->name('profile.edit');
    Route::patch('/profile', UpdateProfileController::class)->name('profile.update');
    Route::delete('/profile', DeleteAccountController::class)->name('profile.destroy');

    Route::get('/scenarios/{scenario}', ShowScenarioController::class)->name('scenarios.show');
});

Route::post('/simulators/single-envelope', RunSingleEnvelopeSimulationController::class)
    ->middleware(['auth', 'verified', 'can:advanced_calculator'])
    ->name('simulators.single-envelope.run');

require __DIR__.'/auth.php';
