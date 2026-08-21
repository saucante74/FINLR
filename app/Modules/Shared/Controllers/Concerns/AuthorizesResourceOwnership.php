<?php

namespace App\Modules\Shared\Controllers\Concerns;

use Illuminate\Contracts\Auth\Authenticatable;

trait AuthorizesResourceOwnership
{
    /**
     * Abort unless the given authenticated user owns the resource, using
     * 404 by default so an existing-but-foreign resource never reveals its
     * existence to a non-owner.
     */
    protected function abortUnlessOwner(?Authenticatable $user, int $ownerId, int $status = 404): void
    {
        if (! $user || (int) $user->getAuthIdentifier() !== $ownerId) {
            abort($status);
        }
    }
}
