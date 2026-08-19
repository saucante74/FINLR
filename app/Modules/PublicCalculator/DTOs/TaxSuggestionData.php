<?php

namespace App\Modules\PublicCalculator\DTOs;

/**
 * A suggested capital gains tax rate for one tax wrapper.
 *
 * The wrapper is carried as a plain string identifier on purpose: the public
 * page only uses it as an i18n key (form.wrappers.*). Reusing the Simulator
 * module's TaxWrapper enum here would make the free page depend on the paid
 * module, which is exactly the coupling this module split removes.
 */
readonly class TaxSuggestionData
{
    public function __construct(
        public string $wrapper,
        public float $rate,
    ) {}

    /**
     * @return array{wrapper: string, rate: float}
     */
    public function toArray(): array
    {
        return [
            'wrapper' => $this->wrapper,
            'rate' => $this->rate,
        ];
    }
}
