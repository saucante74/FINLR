<?php

namespace App\Modules\Auth\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;
use SocialiteProviders\Microsoft\MicrosoftExtendSocialite;

/**
 * Laravel Socialite ships a `google` driver out of the box, but not
 * `microsoft` — that one comes from the community `socialiteproviders/
 * microsoft` package, which plugs into Socialite via this event instead of
 * a config array (see https://socialiteproviders.com/Microsoft/).
 */
class SocialiteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Event::listen(SocialiteWasCalled::class, MicrosoftExtendSocialite::class);
    }
}
