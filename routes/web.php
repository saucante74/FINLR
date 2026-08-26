<?php

use App\Modules\FreemiumCalculator\Controllers\ShowFreemiumCalculatorController;
use App\Modules\Scenarios\Controllers\RenameScenarioController;
use App\Modules\Scenarios\Controllers\ShowScenarioController;
use App\Modules\Shared\Controllers\ShowDashboardController;
use App\Modules\SingleEnvelopeSimulator\Controllers\RunSingleEnvelopeSimulationController;
use App\Modules\SingleEnvelopeSimulator\Controllers\ShowSingleEnvelopeSimulatorController;
use App\Modules\SingleEnvelopeSimulator\Controllers\ShowWrapperChoiceController;
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
    Route::patch('/scenarios/{scenario}', RenameScenarioController::class)->name('scenarios.rename');
});

// Entry point: pick a wrapper before reaching the parameterised form.
Route::get('/simulators/single-envelope', ShowWrapperChoiceController::class)
    ->middleware(['auth', 'verified', 'can:advanced_calculator'])
    ->name('simulators.single-envelope.choose');

// {jurisdiction} and {wrapper} resolve through Laravel's implicit enum
// binding, which 404s on values that aren't cases of the enum. The
// controllers additionally 404 on a wrapper the jurisdiction doesn't offer.
Route::get('/simulators/single-envelope/{jurisdiction}/{wrapper}', ShowSingleEnvelopeSimulatorController::class)
    ->middleware(['auth', 'verified', 'can:advanced_calculator'])
    ->name('simulators.single-envelope.show');

Route::post('/simulators/single-envelope/{jurisdiction}/{wrapper}', RunSingleEnvelopeSimulationController::class)
    ->middleware(['auth', 'verified', 'can:advanced_calculator', 'throttle:run-simulation'])
    ->name('simulators.single-envelope.run');

require __DIR__.'/auth.php';
