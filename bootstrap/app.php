<?php

use App\Modules\Shared\Middleware\HandleInertiaRequests;
use App\Modules\SimulationEngine\Exceptions\SimulationEngineUnavailableException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        // Any simulator using RunProjectionCalculationAction gets this
        // handling for free: the actual failure is already logged (with its
        // original cause preserved) by the time it reaches here, so this
        // only turns it into a redirect with a generic, translated message.
        $exceptions->render(fn (SimulationEngineUnavailableException $exception): RedirectResponse => back()->withErrors([
            'simulation' => __('simulator.singleEnvelope.form.calculationFailed'),
        ]));
    })->create();
