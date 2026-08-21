<?php

namespace App\Modules\SimulationEngine\Support;

use Composer\InstalledVersions;
use RuntimeException;

final class EngineVersion
{
    private const string PACKAGE = 'saucante74/finlr-engine';

    public static function current(): string
    {
        if (! InstalledVersions::isInstalled(self::PACKAGE)) {
            throw new RuntimeException(
                'The private saucante74/finlr-engine package is not installed. '.
                'EngineVersion::current() cannot resolve an installed version without it.'
            );
        }

        $version = InstalledVersions::getPrettyVersion(self::PACKAGE);

        if ($version === null) {
            throw new RuntimeException(
                'The private saucante74/finlr-engine package has no resolvable pretty version.'
            );
        }

        return $version;
    }
}
