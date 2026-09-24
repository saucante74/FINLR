<?php

use App\Modules\AnalogySimulator\Controllers\RunAnalogyComparisonController;
use App\Modules\AnalogySimulator\Controllers\ShowAnalogySimulatorController;
use App\Modules\Auth\Controllers\ConfirmTwoFactorActivationController;
use App\Modules\Auth\Controllers\DisableTwoFactorController;
use App\Modules\Auth\Controllers\ForgetTrustedDeviceController;
use App\Modules\Auth\Controllers\ForgetTrustedDevicesController;
use App\Modules\Auth\Controllers\RequestTwoFactorActivationController;
use App\Modules\FireSimulator\Controllers\RunFireProjectionController;
use App\Modules\FireSimulator\Controllers\ShowFireSimulatorController;
use App\Modules\FreemiumCalculator\Controllers\ShowFreemiumCalculatorController;
use App\Modules\MultiEnvelopeSimulator\Controllers\RunMultiEnvelopeSimulationController;
use App\Modules\MultiEnvelopeSimulator\Controllers\ShowMultiEnvelopeSimulatorController;
use App\Modules\Scenarios\Controllers\RenameScenarioController;
use App\Modules\Scenarios\Controllers\ShowScenarioController;
use App\Modules\Shared\Controllers\ShowDashboardController;
use App\Modules\Shared\Controllers\ShowLandingController;
use App\Modules\Shared\Controllers\ShowSimulatorsController;
use App\Modules\SingleEnvelopeSimulator\Controllers\RunSingleEnvelopeSimulationController;
use App\Modules\SingleEnvelopeSimulator\Controllers\ShowSingleEnvelopeSimulatorController;
use App\Modules\SingleEnvelopeSimulator\Controllers\ShowWrapperChoiceController;
use App\Modules\Subscriptions\Controllers\ShowBillingPortalController;
use App\Modules\Subscriptions\Controllers\ShowCheckoutSuccessController;
use App\Modules\Subscriptions\Controllers\StartCheckoutController;
use App\Modules\Subscriptions\Support\PremiumSimulatorRoutes;
use App\Modules\User\Controllers\DeleteAccountController;
use App\Modules\User\Controllers\EditSettingsController;
use App\Modules\User\Controllers\UpdateProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', ShowLandingController::class)->name('home');

// The freemium calculator used to be served on "/" and moved here when the
// marketing landing page took that URL over. Its route name is unchanged, so
// every route('calculator.freemium') call keeps pointing at it.
Route::get('/calculator', ShowFreemiumCalculatorController::class)->name('calculator.freemium');

Route::get('/dashboard', ShowDashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/settings', EditSettingsController::class)->name('settings.edit');
    Route::patch('/settings', UpdateProfileController::class)->name('settings.update');
    Route::delete('/settings', DeleteAccountController::class)->name('settings.destroy');

    Route::post('/settings/two-factor', RequestTwoFactorActivationController::class)
        ->middleware('throttle:two-factor-enable')
        ->name('two-factor.enable');

    Route::post('/settings/two-factor/confirm', ConfirmTwoFactorActivationController::class)
        ->middleware('throttle:two-factor-confirm')
        ->name('two-factor.confirm');

    Route::delete('/settings/two-factor', DisableTwoFactorController::class)->name('two-factor.disable');

    Route::delete('/settings/two-factor/trusted-devices', ForgetTrustedDevicesController::class)
        ->name('two-factor.trusted-devices.forget');

    Route::delete('/settings/two-factor/trusted-devices/{trustedDevice}', ForgetTrustedDeviceController::class)
        ->whereNumber('trustedDevice')
        ->name('two-factor.trusted-devices.forget-one');

    Route::get('/scenarios/{scenario}', ShowScenarioController::class)->name('scenarios.show');
    Route::patch('/scenarios/{scenario}', RenameScenarioController::class)->name('scenarios.rename');

    // Stripe's webhook is not declared here: Cashier registers its native
    // route itself (POST /stripe/webhook, name "cashier.webhook").
    Route::post('/billing/checkout', StartCheckoutController::class)
        ->middleware('throttle:billing-checkout')
        ->name('billing.checkout');

    Route::get('/billing/checkout/success', ShowCheckoutSuccessController::class)->name('billing.checkout.success');

    Route::get('/billing/portal', ShowBillingPortalController::class)->name('billing.portal');
});

// Listing page, open to every verified user: it only shows which simulators
// the user's plan unlocks (display). Access itself is enforced by the group
// below, on every show and run route.
Route::get('/simulators', ShowSimulatorsController::class)
    ->middleware(['auth', 'verified'])
    ->name('simulators.index');

// Every premium simulator route goes in this group: prefix, name and the
// advanced_calculator Gate come from PremiumSimulatorRoutes, never from the
// individual route. PremiumSimulatorRoutesTest fails on any simulator route
// left outside it.
PremiumSimulatorRoutes::register(function () {
    // Entry point: pick a wrapper before reaching the parameterised form.
    Route::get('/single-envelope', ShowWrapperChoiceController::class)->name('single-envelope.choose');

    // {jurisdiction} and {wrapper} resolve through Laravel's implicit enum
    // binding, which 404s on values that aren't cases of the enum. The
    // controllers additionally 404 on a wrapper the jurisdiction doesn't offer.
    Route::get('/single-envelope/{jurisdiction}/{wrapper}', ShowSingleEnvelopeSimulatorController::class)
        ->name('single-envelope.show');

    Route::post('/single-envelope/{jurisdiction}/{wrapper}', RunSingleEnvelopeSimulationController::class)
        ->middleware('throttle:run-simulation')
        ->name('single-envelope.run');

    Route::get('/multi-envelope', ShowMultiEnvelopeSimulatorController::class)->name('multi-envelope.show');

    Route::post('/multi-envelope', RunMultiEnvelopeSimulationController::class)
        ->middleware('throttle:run-simulation')
        ->name('multi-envelope.run');

    Route::get('/analogy', ShowAnalogySimulatorController::class)->name('analogy.show');

    Route::post('/analogy', RunAnalogyComparisonController::class)
        ->middleware('throttle:run-simulation')
        ->name('analogy.run');

    Route::get('/fire', ShowFireSimulatorController::class)->name('fire.show');

    Route::post('/fire', RunFireProjectionController::class)
        ->middleware('throttle:run-simulation')
        ->name('fire.run');
});

require __DIR__.'/auth.php';
