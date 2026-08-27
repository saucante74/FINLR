<?php

namespace App\Modules\Auth\Models;

use App\Modules\Auth\Enums\OAuthProvider;
use App\Modules\User\Models\User;
use Database\Factories\OAuthAccountFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'provider', 'provider_id'])]
class OAuthAccount extends Model
{
    /** @use HasFactory<OAuthAccountFactory> */
    use HasFactory;

    // Eloquent's Str::snake() turns "OAuthAccount" into "o_auth_accounts"
    // (it treats every capital as a new word boundary, splitting "OAuth"
    // itself), not the "oauth_accounts" the migration actually creates.
    protected $table = 'oauth_accounts';

    protected static function newFactory(): OAuthAccountFactory
    {
        return OAuthAccountFactory::new();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'provider' => OAuthProvider::class,
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
