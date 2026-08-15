<?php

namespace App\Modules\Auth\DTOs;

use App\Modules\Auth\Requests\RegisterUserRequest;

readonly class RegisterUserData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(RegisterUserRequest $request): self
    {
        /** @var array{name: string, email: string, password: string} $validated */
        $validated = $request->validated();

        return new self(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password'],
        );
    }
}
