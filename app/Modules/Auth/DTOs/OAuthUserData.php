<?php

namespace App\Modules\Auth\DTOs;

use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use RuntimeException;

readonly class OAuthUserData
{
    public function __construct(
        public string $providerId,
        public string $email,
        public string $name,
    ) {}

    public static function fromSocialiteUser(SocialiteUser $socialiteUser): self
    {
        $email = (string) $socialiteUser->getEmail();

        if ($email === '') {
            throw new RuntimeException('The OAuth provider did not return an email address.');
        }

        $name = (string) ($socialiteUser->getName() ?: $socialiteUser->getNickname() ?: Str::before($email, '@'));

        return new self(
            providerId: (string) $socialiteUser->getId(),
            email: $email,
            name: $name,
        );
    }
}
