<?php

namespace App\Modules\Shared\Models;

use App\Modules\Subscriptions\Enums\Permission;
use App\Modules\Subscriptions\Enums\Plan;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Gate;

#[Fillable(['name', 'email', 'password', 'subscription_plan'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'subscription_plan' => Plan::FREE->value,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'subscription_plan' => Plan::class,
        ];
    }

    public function hasPermission(Permission $permission): bool
    {
        return Gate::forUser($this)->allows($permission->value);
    }
}
