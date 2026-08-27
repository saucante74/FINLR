<?php

namespace Database\Factories;

use App\Modules\Auth\Enums\OAuthProvider;
use App\Modules\Auth\Models\OAuthAccount;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OAuthAccount>
 */
#[UseModel(OAuthAccount::class)]
class OAuthAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'provider' => OAuthProvider::GOOGLE,
            'provider_id' => (string) $this->faker->unique()->numerify('##########'),
        ];
    }
}
