<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Enums\TaxRegime;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use saucante74\CalculatorEngine\Strategies\TaxRegime as PackageTaxRegime;

class TaxRegimeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    /**
     * @return array<string, array{TaxRegime}>
     */
    public static function taxRegimeProvider(): array
    {
        return array_combine(
            array_map(static fn (TaxRegime $case): string => $case->name, TaxRegime::cases()),
            array_map(static fn (TaxRegime $case): array => [$case], TaxRegime::cases()),
        );
    }

    #[DataProvider('taxRegimeProvider')]
    public function test_it_round_trips_every_case_through_the_package_enum(TaxRegime $taxRegime): void
    {
        $this->assertSame($taxRegime, TaxRegime::fromPackage($taxRegime->toPackage()));
    }

    public function test_it_covers_exactly_the_packages_six_cases(): void
    {
        $this->assertCount(6, TaxRegime::cases());
        $this->assertSame(
            array_map(static fn (PackageTaxRegime $case): string => $case->value, PackageTaxRegime::cases()),
            array_map(static fn (TaxRegime $case): string => $case->value, TaxRegime::cases()),
        );
    }
}
