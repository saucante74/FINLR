<?php

namespace App\Modules\SimulationEngine\DTOs;

use App\Modules\SimulationEngine\Enums\AccountType;

/**
 * Input of MultiEnvelopeEngineInterface::calculate(), mirroring the
 * parameters of
 * saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\Actions\MultiEnvelopeSimulator::calculateIndependentCascade()
 * (docs/API.md §2): a non-empty cascade of envelopes, the overflow
 * destination (`null` = no overflow at all), and the shared fiscal
 * profile.
 */
readonly class MultiEnvelopeCalculationInputData
{
    /**
     * @param  non-empty-array<int, EnvelopeConfigData>  $envelopes
     */
    public function __construct(
        public array $envelopes,
        public ?AccountType $defaultOverflowAccountType = AccountType::CompteCourant,
        public FiscalProfileData $fiscalProfile = new FiscalProfileData,
    ) {}
}
