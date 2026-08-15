<?php

namespace App\Modules\User\Actions;

use App\Modules\User\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeleteAccountAction
{
    public function handle(Request $request, User $user): void
    {
        Auth::logout();

        $user->delete();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
    }
}
