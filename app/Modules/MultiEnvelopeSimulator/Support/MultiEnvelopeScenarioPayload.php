<?php

namespace App\Modules\MultiEnvelopeSimulator\Support;

use App\Modules\SimulationEngine\DTOs\EnvelopeConfigData;
use App\Modules\SimulationEngine\DTOs\FiscalProfileData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationInputData;
use App\Modules\SimulationEngine\DTOs\MultiEnvelopeCalculationResultData;
use App\Modules\SimulationEngine\DTOs\PocketResultData;
use App\Modules\SimulationEngine\DTOs\YearlyResultData;

/**
 * Converts SimulationEngine's multi-envelope DTOs to plain arrays for
 * storage in Scenario::$input_payload/$result_payload.
 *
 * This lives here rather than as toArray() methods on the DTOs themselves
 * (the pattern CalculationInputData/CalculationResultData use) because this
 * step's brief reuses those DTOs "telles quelles, sans les modifier" — they
 * were finalized in a prior step. Purely mechanical field-by-field mapping,
 * no business logic.
 */
final class MultiEnvelopeScenarioPayload
{
    /**
     * @return array{
     *     envelopes: list<array<string, mixed>>,
     *     defaultOverflowAccountType: string|null,
     *     fiscalProfile: array<string, mixed>,
     * }
     */
    public static function input(MultiEnvelopeCalculationInputData $input): array
    {
        return [
            'envelopes' => array_map(self::envelopeConfig(...), $input->envelopes),
            'defaultOverflowAccountType' => $input->defaultOverflowAccountType?->value,
            'fiscalProfile' => self::fiscalProfile($input->fiscalProfile),
        ];
    }

    /**
     * @return array{
     *     summary: array<string, mixed>,
     *     yearlyBreakdown: list<array<string, mixed>>,
     *     pockets: list<array<string, mixed>>,
     *     totalBrokerageFeesAmount: float,
     *     totalManagementFeesAmount: float,
     *     totalTerImpactAmount: float,
     *     totalCustodyFeesAmount: float,
     *     totalArbitrageFeesAmount: float,
     *     totalFeesAmount: float,
     * }
     */
    public static function result(MultiEnvelopeCalculationResultData $result): array
    {
        return [
            'summary' => self::yearlyResult($result->summary),
            'yearlyBreakdown' => array_map(self::yearlyResult(...), $result->yearlyBreakdown),
            'pockets' => array_map(self::pocketResult(...), $result->pockets),
            'totalBrokerageFeesAmount' => $result->totalBrokerageFeesAmount,
            'totalManagementFeesAmount' => $result->totalManagementFeesAmount,
            'totalTerImpactAmount' => $result->totalTerImpactAmount,
            'totalCustodyFeesAmount' => $result->totalCustodyFeesAmount,
            'totalArbitrageFeesAmount' => $result->totalArbitrageFeesAmount,
            'totalFeesAmount' => $result->totalFeesAmount(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function envelopeConfig(EnvelopeConfigData $config): array
    {
        return [
            'accountType' => $config->accountType->value,
            'initialAmount' => $config->initialAmount,
            'monthlyContribution' => $config->monthlyContribution,
            'durationYears' => $config->durationYears,
            'annualReturnRate' => $config->annualReturnRate,
            'terRate' => $config->terRate,
            'brokerageFeeRate' => $config->brokerageFeeRate,
            'managementFeeRate' => $config->managementFeeRate,
            'custodyFeeRate' => $config->custodyFeeRate,
            'custodyFeeFixedMonthly' => $config->custodyFeeFixedMonthly,
            'arbitrageFeeRate' => $config->arbitrageFeeRate,
            'arbitrageFeeFixed' => $config->arbitrageFeeFixed,
            'inflationRate' => $config->inflationRate,
            'isUncapped' => $config->isUncapped,
            'customTaxRate' => $config->customTaxRate,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function fiscalProfile(FiscalProfileData $profile): array
    {
        return [
            'marginalIncomeTaxRate' => $profile->marginalIncomeTaxRate,
            'forcedRegime' => $profile->forcedRegime?->value,
            'isCoupleHousehold' => $profile->isCoupleHousehold,
            'socialLeviesStandard' => $profile->socialLeviesStandard,
            'socialLeviesReduced' => $profile->socialLeviesReduced,
            'flatTaxIncomeRate' => $profile->flatTaxIncomeRate,
            'lifeInsuranceReducedRate' => $profile->lifeInsuranceReducedRate,
            'lifeInsurancePremiumThreshold' => $profile->lifeInsurancePremiumThreshold,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function yearlyResult(YearlyResultData $year): array
    {
        return [
            'year' => $year->year,
            'totalDeposited' => $year->totalDeposited,
            'grossBalance' => $year->grossBalance,
            'totalGains' => $year->totalGains,
            'taxesAmount' => $year->taxesAmount,
            'netBalance' => $year->netBalance,
            'realNetBalanceWithInflation' => $year->realNetBalanceWithInflation,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function pocketResult(PocketResultData $pocket): array
    {
        return [
            'accountType' => $pocket->accountType->value,
            'initialDeposit' => $pocket->initialDeposit,
            'dcaDeposited' => $pocket->dcaDeposited,
            'totalDeposited' => $pocket->totalDeposited,
            'dcaMonthsCount' => $pocket->dcaMonthsCount,
            'lastDcaAmount' => $pocket->lastDcaAmount,
            'firstResidualDcaAmount' => $pocket->firstResidualDcaAmount,
            'ceilingReachedMonth' => $pocket->ceilingReachedMonth,
            'grossBalance' => $pocket->grossBalance,
            'totalGains' => $pocket->totalGains,
            'taxesAmount' => $pocket->taxesAmount,
            'incomeTaxAmount' => $pocket->incomeTaxAmount,
            'socialLeviesAmount' => $pocket->socialLeviesAmount,
            'taxRegime' => $pocket->taxRegime->value,
            'netBalance' => $pocket->netBalance,
            'brokerageFeesAmount' => $pocket->brokerageFeesAmount,
            'managementFeesAmount' => $pocket->managementFeesAmount,
            'terImpactAmount' => $pocket->terImpactAmount,
            'custodyFeesAmount' => $pocket->custodyFeesAmount,
            'arbitrageFeesAmount' => $pocket->arbitrageFeesAmount,
            'totalFeesAmount' => $pocket->totalFeesAmount(),
        ];
    }
}
