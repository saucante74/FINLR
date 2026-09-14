<?php

namespace App\Modules\User\Models;

use App\Modules\Auth\Models\OAuthAccount;
use App\Modules\Scenarios\Models\Scenario;
use App\Modules\Subscriptions\Enums\Permission;
use App\Modules\Subscriptions\Enums\Plan;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Gate;
use Laravel\Cashier\Billable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use Billable, HasFactory, Notifiable;

    public const SUBSCRIPTION_TYPE = 'default';

    protected static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'two_factor_enabled_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Derived from Cashier on every read — never stored — so access rights
    // can't drift out of sync with the actual Stripe subscription.
    public function plan(): Plan
    {
        return $this->subscribed(self::SUBSCRIPTION_TYPE) ? Plan::PREMIUM : Plan::FREE;
    }

    public function hasPermission(Permission $permission): bool
    {
        return Gate::forUser($this)->allows($permission->value);
    }

    /**
     * @return HasMany<Scenario, $this>
     */
    public function scenarios(): HasMany
    {
        return $this->hasMany(Scenario::class);
    }

    /**
     * @return HasMany<OAuthAccount, $this>
     */
    public function oauthAccounts(): HasMany
    {
        return $this->hasMany(OAuthAccount::class);
    }
}
