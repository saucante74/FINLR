<?php

namespace App\Modules\Auth\DTOs;

use App\Modules\Auth\Requests\PasswordResetLinkRequest;

readonly class PasswordResetLinkData
{
    public function __construct(
        public string $email,
    ) {}

    public static function fromRequest(PasswordResetLinkRequest $request): self
    {
        /** @var array{email: string} $validated */
        $validated = $request->validated();

        return new self(
            email: $validated['email'],
        );
    }

    /**
     * @return array{email: string}
     */
    public function toArray(): array
    {
        return ['email' => $this->email];
    }
}
