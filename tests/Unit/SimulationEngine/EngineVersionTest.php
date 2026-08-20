<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Support\EngineVersion;
use Composer\InstalledVersions;
use PHPUnit\Framework\TestCase;

class EngineVersionTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! InstalledVersions::isInstalled('saucante74/finlr-engine')) {
            $this->markTestSkipped('The private saucante74/finlr-engine package is not installed.');
        }
    }

    public function test_current_returns_the_actually_installed_version(): void
    {
        $version = EngineVersion::current();

        $this->assertNotSame('', $version);
        $this->assertSame(InstalledVersions::getPrettyVersion('saucante74/finlr-engine'), $version);
    }
}
