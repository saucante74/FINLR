<?php

namespace App\Modules\Shared\Actions;

use App\Modules\Shared\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeleteAccountAction
{
    /**
     * Log the user out and delete their account.
     */
    public function handle(Request $request, User $user): void
    {
        Auth::logout();

        $user->delete();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
    }
}
