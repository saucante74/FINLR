<?php

namespace Tests\Feature\Subscriptions;

use App\Modules\FireSimulator\Controllers\ShowFireSimulatorController;
use App\Modules\Subscriptions\Support\PremiumSimulatorRoutes;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Structural guard for premium simulator access. Instead of one assertion per
 * known route, it reads the live route table: a simulator route added
 * tomorrow — inside PremiumSimulatorRoutes or, by mistake, outside it — is
 * checked without anyone having to remember to extend this file.
 */
class PremiumSimulatorRoutesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Simulator-related routes deliberately open to every verified user. Each
     * entry must be a page that grants no premium feature by itself.
     */
    private const UNGATED_ALLOWLIST = [
        // Listing: shows which simulators the plan unlocks, links only.
        'simulators.index',
    ];

    /**
     * Valid values for route parameters, so a request reaches the Gate
     * instead of 404ing on implicit enum binding first.
     */
    private const ROUTE_PARAMETERS = [
        'jurisdiction' => 'france',
        'wrapper' => 'pea',
    ];

    private const KNOWN_PREMIUM_ROUTE_COUNT = 9;

    public function test_every_simulator_route_runs_behind_the_premium_gate_except_the_listing(): void
    {
        $this->assertSame([], $this->ungatedSimulatorRoutes());

        // Guards against a scan that silently matches nothing.
        $this->assertGreaterThanOrEqual(self::KNOWN_PREMIUM_ROUTE_COUNT, count($this->gatedSimulatorRoutes()));
    }

    public function test_the_route_scan_catches_a_simulator_route_declared_outside_the_group(): void
    {
        Route::middleware(['web', 'auth', 'verified'])->group(function () {
            // Same prefix, forgotten Gate.
            Route::get('/simulators/rogue', fn () => 'leak')->name('rogue.by-prefix');
            // Different URL, but a simulator module's controller.
            Route::get('/tools/fire', ShowFireSimulatorController::class)->name('rogue.by-controller');
        });
        $this->refreshRouteLookups();

        $this->assertSame(['rogue.by-prefix', 'rogue.by-controller'], $this->ungatedSimulatorRoutes());
    }

    public function test_a_new_route_declared_in_the_group_inherits_the_premium_gate(): void
    {
        // Registered exactly like routes/web.php does, with nothing but a path,
        // an action and a name: no middleware written on the route itself.
        Route::middleware('web')->group(function () {
            PremiumSimulatorRoutes::register(function () {
                Route::get('/brand-new', fn () => 'brand new simulator')->name('brand-new.show');
            });
        });
        $this->refreshRouteLookups();

        $route = Route::getRoutes()->getByName('simulators.brand-new.show');
        $this->assertNotNull($route);
        $this->assertSame('simulators/brand-new', $route->uri());
        $this->assertContains(PremiumSimulatorRoutes::GATE_MIDDLEWARE, $route->gatherMiddleware());
        $this->assertSame([], $this->ungatedSimulatorRoutes());

        $this->get(route('simulators.brand-new.show'))->assertRedirect(route('login'));

        $this->actingAs(User::factory()->unverified()->create())
            ->get(route('simulators.brand-new.show'))
            ->assertRedirect(route('verification.notice'));

        $this->actingAs(User::factory()->create())
            ->get(route('simulators.brand-new.show'))
            ->assertForbidden();

        $this->actingAs(User::factory()->premium()->create())
            ->get(route('simulators.brand-new.show'))
            ->assertOk()
            ->assertSee('brand new simulator');
    }

    public function test_a_free_user_is_refused_every_premium_simulator_route(): void
    {
        $free = User::factory()->create();

        foreach ($this->gatedSimulatorRoutes() as $route) {
            $method = collect($route->methods())->first(fn (string $method): bool => $method !== 'HEAD');

            $this->actingAs($free)
                ->call($method, url($this->uriWithParameters($route)))
                ->assertForbidden();
        }
    }

    public function test_a_free_user_can_open_the_listing_but_none_of_the_simulators_it_links_to(): void
    {
        $free = User::factory()->create();

        $this->actingAs($free)
            ->get(route('simulators.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('simulator/Simulators')
                ->where('auth.permissions', ['create_project'])
            );

        foreach ([
            route('simulators.single-envelope.choose'),
            route('simulators.single-envelope.show', self::ROUTE_PARAMETERS),
            route('simulators.multi-envelope.show'),
            route('simulators.analogy.show'),
            route('simulators.fire.show'),
        ] as $url) {
            $this->actingAs($free)->get($url)->assertForbidden();
        }

        foreach ([
            route('simulators.single-envelope.run', self::ROUTE_PARAMETERS),
            route('simulators.multi-envelope.run'),
            route('simulators.analogy.run'),
            route('simulators.fire.run'),
        ] as $url) {
            $this->actingAs($free)->post($url)->assertForbidden();
        }
    }

    public function test_a_premium_user_sees_the_advanced_calculator_permission_on_the_listing(): void
    {
        $this->actingAs(User::factory()->premium()->create())
            ->get(route('simulators.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.permissions', fn ($permissions): bool => collect($permissions)->contains('advanced_calculator'))
            );
    }

    /**
     * @return list<string>
     */
    private function ungatedSimulatorRoutes(): array
    {
        return collect(Route::getRoutes()->getRoutes())
            ->filter(fn (RoutingRoute $route): bool => $this->isSimulatorRoute($route))
            ->reject(fn (RoutingRoute $route): bool => in_array($route->getName(), self::UNGATED_ALLOWLIST, true))
            ->reject(fn (RoutingRoute $route): bool => in_array(PremiumSimulatorRoutes::GATE_MIDDLEWARE, $route->gatherMiddleware(), true))
            ->map(fn (RoutingRoute $route): string => $route->getName() ?? $route->uri())
            ->values()
            ->all();
    }

    /**
     * @return list<RoutingRoute>
     */
    private function gatedSimulatorRoutes(): array
    {
        return collect(Route::getRoutes()->getRoutes())
            ->filter(fn (RoutingRoute $route): bool => $this->isSimulatorRoute($route))
            ->filter(fn (RoutingRoute $route): bool => in_array(PremiumSimulatorRoutes::GATE_MIDDLEWARE, $route->gatherMiddleware(), true))
            ->values()
            ->all();
    }

    /**
     * A route counts as a simulator route by its URL, its name, or the module
     * its controller lives in — so moving a simulator to another URL doesn't
     * take it out of the check.
     */
    private function isSimulatorRoute(RoutingRoute $route): bool
    {
        $uri = $route->uri();

        return $uri === PremiumSimulatorRoutes::PREFIX
            || str_starts_with($uri, PremiumSimulatorRoutes::PREFIX.'/')
            || Str::startsWith((string) $route->getName(), PremiumSimulatorRoutes::NAME)
            || preg_match('/^App\\\\Modules\\\\\w+Simulator\\\\/', $route->getActionName()) === 1;
    }

    private function uriWithParameters(RoutingRoute $route): string
    {
        return (string) preg_replace_callback('/\{(\w+)\??\}/', function (array $matches) use ($route): string {
            $this->assertArrayHasKey(
                $matches[1],
                self::ROUTE_PARAMETERS,
                "Route {$route->getName()} uses an unknown parameter {{$matches[1]}}: add a valid value to ROUTE_PARAMETERS.",
            );

            return self::ROUTE_PARAMETERS[$matches[1]];
        }, $route->uri());
    }

    private function refreshRouteLookups(): void
    {
        Route::getRoutes()->refreshNameLookups();
        Route::getRoutes()->refreshActionLookups();
    }
}
