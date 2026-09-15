<?php

namespace App\Modules\Subscriptions\Support;

use App\Modules\Subscriptions\Enums\Permission;
use Closure;
use Illuminate\Support\Facades\Route;

/**
 * The single place premium simulator routes are declared in. Anything
 * registered through register() is prefixed `/simulators`, named
 * `simulators.*` and runs behind auth + verified + the advanced_calculator
 * Gate — a route can't be added here without inheriting the check.
 *
 * A route declared elsewhere under that prefix, name or a *Simulator module
 * controller is caught by tests/Feature/Subscriptions/PremiumSimulatorRoutesTest,
 * which reads the live route table rather than a list kept by hand.
 */
final class PremiumSimulatorRoutes
{
    public const PREFIX = 'simulators';

    public const NAME = 'simulators.';

    public const GATE_MIDDLEWARE = 'can:'.Permission::ADVANCED_CALCULATOR->value;

    public static function register(Closure $routes): void
    {
        Route::middleware(['auth', 'verified', self::GATE_MIDDLEWARE])
            ->prefix(self::PREFIX)
            ->name(self::NAME)
            ->group($routes);
    }
}
