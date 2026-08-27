<?php

namespace App\Modules\Auth\Enums;

enum OAuthProvider: string
{
    case GOOGLE = 'google';
    case MICROSOFT = 'microsoft';

    public function label(): string
    {
        return match ($this) {
            self::GOOGLE => 'Google',
            self::MICROSOFT => 'Microsoft',
        };
    }
}
