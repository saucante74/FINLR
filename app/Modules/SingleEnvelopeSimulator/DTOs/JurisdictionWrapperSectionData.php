<?php

namespace App\Modules\SingleEnvelopeSimulator\DTOs;

use App\Modules\SimulationEngine\Enums\TaxWrapper;
use App\Modules\SingleEnvelopeSimulator\Enums\Jurisdiction;

/**
 * One jurisdiction section on the wrapper-choice page: which country, and
 * which wrappers it offers. Both are read from the enums, never hand-listed.
 *
 * Labels are deliberately absent — the frontend resolves them from the
 * jurisdiction/wrapper value through react-i18next, so translations stay the
 * single source of truth for copy instead of being duplicated server-side.
 */
readonly class JurisdictionWrapperSectionData
{
    /**
     * @param  list<string>  $wrappers
     */
    public function __construct(
        public string $jurisdiction,
        public array $wrappers,
    ) {}

    public static function fromJurisdiction(Jurisdiction $jurisdiction): self
    {
        return new self(
            jurisdiction: $jurisdiction->value,
            wrappers: array_map(
                fn (TaxWrapper $wrapper): string => $wrapper->value,
                $jurisdiction->wrappers(),
            ),
        );
    }

    /**
     * @return array{jurisdiction: string, wrappers: list<string>}
     */
    public function toArray(): array
    {
        return [
            'jurisdiction' => $this->jurisdiction,
            'wrappers' => $this->wrappers,
        ];
    }
}
