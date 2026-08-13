<?php

namespace App\Modules\Shared\Middleware;

use App\Modules\Subscriptions\Enums\Permission;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'plan' => $user?->subscription_plan?->value,
                'permissions' => $user
                    ? collect(Permission::cases())
                        ->filter(fn (Permission $permission) => $user->hasPermission($permission))
                        ->map(fn (Permission $permission) => $permission->value)
                        ->values()
                    : [],
            ],
        ];
    }
}
