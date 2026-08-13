<?php

namespace App\Modules\Shared\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Modules\Subscriptions\Enums\Permission;
use App\Modules\Subscriptions\Enums\Plan;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Gate;

#[Fillable(['name', 'email', 'password', 'subscription_plan'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Create a new factory instance for the model.
     *
     * Required because the model lives outside the conventional
     * App\Models namespace, which HasFactory's default resolver assumes.
     *
     * @return UserFactory
     */
    protected static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }

    /**
     * The model's default attribute values.
     *
     * Mirrors the `subscription_plan` column's database default so a
     * freshly instantiated (unsaved or just-created) model already
     * reflects it, instead of only the persisted row.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'subscription_plan' => Plan::FREE->value,
    ];

    /**
     * Get the attributes that should be cast.
     *
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
