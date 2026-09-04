<?php

namespace Tests\Unit\SimulationEngine;

use App\Modules\SimulationEngine\Enums\AccountType;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use saucante74\CalculatorEngine\Enums\AccountType as PackageAccountType;

class AccountTypeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists('saucante74\\CalculatorEngine\\CalculatorEngine')) {
            $this->markTestSkipped('The private saucante74\\CalculatorEngine package is not installed.');
        }
    }

    /**
     * @return array<string, array{AccountType}>
     */
    public static function accountTypeProvider(): array
    {
        return array_combine(
            array_map(static fn (AccountType $case): string => $case->name, AccountType::cases()),
            array_map(static fn (AccountType $case): array => [$case], AccountType::cases()),
        );
    }

    #[DataProvider('accountTypeProvider')]
    public function test_it_round_trips_every_case_through_the_package_enum(AccountType $accountType): void
    {
        $this->assertSame($accountType, AccountType::fromPackage($accountType->toPackage()));
    }

    public function test_it_covers_exactly_the_packages_eight_cases(): void
    {
        $this->assertCount(8, AccountType::cases());
        $this->assertSame(
            array_map(static fn (PackageAccountType $case): string => $case->value, PackageAccountType::cases()),
            array_map(static fn (AccountType $case): string => $case->value, AccountType::cases()),
        );
    }
}
