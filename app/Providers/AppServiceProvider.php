<?php

namespace App\Providers;

use App\Modules\Shared\Models\User;
use App\Modules\Subscriptions\Enums\Permission;
use App\Modules\Subscriptions\Enums\Plan;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        $this->registerSubscriptionGates();
    }

    /**
     * Register the Gates granting each Permission based on the user's subscription Plan.
     */
    private function registerSubscriptionGates(): void
    {
        foreach (Permission::cases() as $permission) {
            Gate::define($permission->value, function (User $user) use ($permission): bool {
                return match ($user->subscription_plan) {
                    Plan::FREE => $permission === Permission::CREATE_PROJECT,
                    Plan::PRO_MONTHLY, Plan::PRO_YEARLY, Plan::ENTERPRISE => true,
                };
            });
        }
    }
}
