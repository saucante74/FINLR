<?php

namespace App\Modules\User\DTOs;

use App\Modules\User\Requests\ProfileUpdateRequest;

readonly class ProfileUpdateData
{
    public function __construct(
        public string $name,
        public string $email,
    ) {}

    public static function fromRequest(ProfileUpdateRequest $request): self
    {
        /** @var array{name: string, email: string} $validated */
        $validated = $request->validated();

        return new self(
            name: $validated['name'],
            email: $validated['email'],
        );
    }
}
