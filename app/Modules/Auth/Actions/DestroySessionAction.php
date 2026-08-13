<?php

namespace App\Modules\Auth\Actions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DestroySessionAction
{
    /**
     * Log the user out and invalidate their session.
     */
    public function handle(Request $request): void
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
    }
}
