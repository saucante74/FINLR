<?php

namespace Database\Factories;

use App\Modules\Subscriptions\Enums\BillingPeriod;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Cashier\Subscription;

/**
 * @extends Factory<User>
 */
#[UseModel(User::class)]
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user holds an active Cashier subscription — the only
     * source of the premium plan (User::plan()), no network call involved.
     */
    public function premium(BillingPeriod $period = BillingPeriod::MONTHLY): static
    {
        return $this->has(
            Subscription::factory()
                ->active()
                ->state(['type' => User::SUBSCRIPTION_TYPE])
                ->withPrice($period->priceId()),
            'subscriptions',
        );
    }

    /**
     * Indicate that the model has two-factor authentication enabled.
     */
    public function twoFactorEnabled(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_enabled_at' => now(),
        ]);
    }
}
