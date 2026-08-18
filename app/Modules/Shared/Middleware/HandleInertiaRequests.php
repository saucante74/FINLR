<?php

namespace App\Modules\Shared\Middleware;

use App\Modules\Subscriptions\Enums\Permission;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                // Never share the whole Eloquent model: these props are serialised
                // into the HTML of every page, including the public calculator.
                'user' => $user === null ? null : [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                ],
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
