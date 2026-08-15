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
        return new self(
            name: $request->string('name')->toString(),
            email: $request->string('email')->toString(),
        );
    }
}
