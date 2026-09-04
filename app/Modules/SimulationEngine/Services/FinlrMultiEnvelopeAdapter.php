<?php

namespace App\Modules\SimulationEngine\Services;

use App\Modules\SimulationEngine\Contracts\MultiEnvelopeEngineInterface;
use App\Modules\SimulationEngine\DTOs\EnvelopeConfigData;
use App\Modules\SimulationEngine\DTOs\FiscalProfileData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationResultData;
use App\Modules\SimulationEngine\DTOs\PocketResultData;
use App\Modules\SimulationEngine\DTOs\YearlyResultData;
use App\Modules\SimulationEngine\Enums\AccountType;
use App\Modules\SimulationEngine\Enums\TaxRegime;
use saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\Actions\MultiEnvelopeSimulator;
use saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\DTOs\CalculationResult as PackageCalculationResult;
use saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\DTOs\EnvelopeConfig as PackageEnvelopeConfig;
use saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\DTOs\PocketResult as PackagePocketResult;
use saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\DTOs\YearlyResult as PackageYearlyResult;
use saucante74\CalculatorEngine\Strategies\FiscalProfile as PackageFiscalProfile;
use saucante74\CalculatorEngine\Strategies\FiscalRates as PackageFiscalRates;

/**
 * Adapter around
 * saucante74\CalculatorEngine\Simulators\France\SimulatorMultiEnvelope\Actions\MultiEnvelopeSimulator::calculateIndependentCascade()
 * (docs/API.md §2): translates this module's DTOs to/from the private
 * package's own DTOs so the rest of the application never depends on the
 * package directly.
 */
class FinlrMultiEnvelopeAdapter implements MultiEnvelopeEngineInterface
{
    public function __construct(private readonly MultiEnvelopeSimulator $engine) {}

    public function calculate(MultiEnvelopeCalculationInputData $input): MultiEnvelopeCalculationResultData
    {
        $result = $this->engine->calculateIndependentCascade(
            envelopeConfigs: array_map($this->toPackageEnvelopeConfig(...), $input->envelopes),
            defaultOverflowAccountType: $input->defaultOverflowAccountType?->toPackage(),
            fiscalProfile: $this->toPackageFiscalProfile($input->fiscalProfile),
        );

        return $this->toMultiEnvelopeCalculationResultData($result);
    }

    private function toPackageEnvelopeConfig(EnvelopeConfigData $config): PackageEnvelopeConfig
    {
        return new PackageEnvelopeConfig(
            accountType: $config->accountType->toPackage(),
            initialAmount: $config->initialAmount,
            monthlyContribution: $config->monthlyContribution,
            durationYears: $config->durationYears,
            annualReturnRate: $config->annualReturnRate,
            terRate: $config->terRate,
            brokerageFeeRate: $config->brokerageFeeRate,
            managementFeeRate: $config->managementFeeRate,
            custodyFeeRate: $config->custodyFeeRate,
            custodyFeeFixedMonthly: $config->custodyFeeFixedMonthly,
            arbitrageFeeRate: $config->arbitrageFeeRate,
            arbitrageFeeFixed: $config->arbitrageFeeFixed,
            inflationRate: $config->inflationRate,
            isUncapped: $config->isUncapped,
            customTaxRate: $config->customTaxRate,
        );
    }

    private function toPackageFiscalProfile(FiscalProfileData $profile): PackageFiscalProfile
    {
        return new PackageFiscalProfile(
            marginalIncomeTaxRate: $profile->marginalIncomeTaxRate,
            forcedRegime: $profile->forcedRegime?->toPackage(),
            isCoupleHousehold: $profile->isCoupleHousehold,
            socialLeviesStandard: $profile->socialLeviesStandard ?? PackageFiscalRates::SOCIAL_LEVIES_STANDARD,
            socialLeviesReduced: $profile->socialLeviesReduced ?? PackageFiscalRates::SOCIAL_LEVIES_REDUCED,
            flatTaxIncomeRate: $profile->flatTaxIncomeRate ?? PackageFiscalRates::FLAT_TAX_INCOME_RATE,
            lifeInsuranceReducedRate: $profile->lifeInsuranceReducedRate ?? PackageFiscalRates::LIFE_INSURANCE_REDUCED_INCOME_RATE,
            lifeInsurancePremiumThreshold: $profile->lifeInsurancePremiumThreshold ?? PackageFiscalRates::LIFE_INSURANCE_PREMIUM_THRESHOLD,
        );
    }

    private function toMultiEnvelopeCalculationResultData(PackageCalculationResult $result): MultiEnvelopeCalculationResultData
    {
        return new MultiEnvelopeCalculationResultData(
            summary: $this->toYearlyResultData($result->summary),
            yearlyBreakdown: array_map($this->toYearlyResultData(...), $result->yearlyBreakdown),
            pockets: array_map($this->toPocketResultData(...), $result->pockets),
            totalBrokerageFeesAmount: $result->totalBrokerageFeesAmount,
            totalManagementFeesAmount: $result->totalManagementFeesAmount,
            totalTerImpactAmount: $result->totalTerImpactAmount,
            totalCustodyFeesAmount: $result->totalCustodyFeesAmount,
            totalArbitrageFeesAmount: $result->totalArbitrageFeesAmount,
        );
    }

    private function toYearlyResultData(PackageYearlyResult $yearlyResult): YearlyResultData
    {
        return new YearlyResultData(
            year: $yearlyResult->year,
            totalDeposited: $yearlyResult->totalDeposited,
            grossBalance: $yearlyResult->grossBalance,
            totalGains: $yearlyResult->totalGains,
            taxesAmount: $yearlyResult->taxesAmount,
            netBalance: $yearlyResult->netBalance,
            realNetBalanceWithInflation: $yearlyResult->realNetBalanceWithInflation,
        );
    }

    private function toPocketResultData(PackagePocketResult $pocket): PocketResultData
    {
        return new PocketResultData(
            accountType: AccountType::fromPackage($pocket->accountType),
            initialDeposit: $pocket->initialDeposit,
            dcaDeposited: $pocket->dcaDeposited,
            totalDeposited: $pocket->totalDeposited,
            dcaMonthsCount: $pocket->dcaMonthsCount,
            lastDcaAmount: $pocket->lastDcaAmount,
            firstResidualDcaAmount: $pocket->firstResidualDcaAmount,
            ceilingReachedMonth: $pocket->ceilingReachedMonth,
            grossBalance: $pocket->grossBalance,
            totalGains: $pocket->totalGains,
            taxesAmount: $pocket->taxesAmount,
            incomeTaxAmount: $pocket->incomeTaxAmount,
            socialLeviesAmount: $pocket->socialLeviesAmount,
            taxRegime: TaxRegime::fromPackage($pocket->taxRegime),
            netBalance: $pocket->netBalance,
            brokerageFeesAmount: $pocket->brokerageFeesAmount,
            managementFeesAmount: $pocket->managementFeesAmount,
            terImpactAmount: $pocket->terImpactAmount,
            custodyFeesAmount: $pocket->custodyFeesAmount,
            arbitrageFeesAmount: $pocket->arbitrageFeesAmount,
        );
    }
}
