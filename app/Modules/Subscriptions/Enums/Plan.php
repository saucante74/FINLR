<?php

namespace App\Modules\Subscriptions\Enums;

enum Plan: string
{
    case FREE = 'free';
    case PREMIUM = 'premium';

    public function grants(Permission $permission): bool
    {
        return match ($this) {
            self::FREE => $permission === Permission::CREATE_PROJECT,
            self::PREMIUM => true,
        };
    }
}
