<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Enums\AnalogyLeader;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use saucante74\CalculatorEngine\Analogy\Enums\AnalogyLeader as PackageAnalogyLeader;

class AnalogyLeaderTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    /**
     * @return array<string, array{AnalogyLeader}>
     */
    public static function analogyLeaderProvider(): array
    {
        return array_combine(
            array_map(static fn (AnalogyLeader $case): string => $case->name, AnalogyLeader::cases()),
            array_map(static fn (AnalogyLeader $case): array => [$case], AnalogyLeader::cases()),
        );
    }

    #[DataProvider('analogyLeaderProvider')]
    public function test_it_round_trips_every_case_through_the_package_enum(AnalogyLeader $leader): void
    {
        $this->assertSame($leader, AnalogyLeader::fromPackage($leader->toPackage()));
    }

    public function test_it_covers_exactly_the_packages_three_cases(): void
    {
        $this->assertCount(3, AnalogyLeader::cases());
        $this->assertSame(
            array_map(static fn (PackageAnalogyLeader $case): string => $case->value, PackageAnalogyLeader::cases()),
            array_map(static fn (AnalogyLeader $case): string => $case->value, AnalogyLeader::cases()),
        );
    }
}
