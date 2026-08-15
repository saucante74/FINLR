<?php

namespace App\Modules\Auth\DTOs;

use App\Modules\Auth\Requests\NewPasswordRequest;

readonly class ResetPasswordData
{
    public function __construct(
        public string $token,
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(NewPasswordRequest $request): self
    {
        /** @var array{token: string, email: string, password: string} $validated */
        $validated = $request->validated();

        return new self(
            token: $validated['token'],
            email: $validated['email'],
            password: $validated['password'],
        );
    }

    /**
     * @return array{token: string, email: string, password: string}
     */
    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'email' => $this->email,
            'password' => $this->password,
        ];
    }
}
