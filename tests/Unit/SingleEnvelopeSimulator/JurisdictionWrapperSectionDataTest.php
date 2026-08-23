<?php

namespace Tests\Unit\SingleEnvelopeSimulator;

use App\Modules\SingleEnvelopeSimulator\DTOs\JurisdictionWrapperSectionData;
use App\Modules\SingleEnvelopeSimulator\Enums\Jurisdiction;
use PHPUnit\Framework\TestCase;

class JurisdictionWrapperSectionDataTest extends TestCase
{
    public function test_from_jurisdiction_resolves_the_wrappers_that_jurisdiction_offers(): void
    {
        $section = JurisdictionWrapperSectionData::fromJurisdiction(Jurisdiction::France);

        $this->assertSame('france', $section->jurisdiction);
        $this->assertSame(['pea', 'cto'], $section->wrappers);
    }

    public function test_to_array_produces_the_expected_keys_and_values(): void
    {
        $section = JurisdictionWrapperSectionData::fromJurisdiction(Jurisdiction::France);

        $this->assertSame([
            'jurisdiction' => 'france',
            'wrappers' => ['pea', 'cto'],
        ], $section->toArray());
    }
}
