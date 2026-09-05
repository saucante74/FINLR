/** Mirrors App\Modules\SimulationEngine\Enums\AccountType (8 cases). */
export type AccountType =
    | 'PEA'
    | 'PEA_PME'
    | 'CTO'
    | 'ASSURANCE_VIE'
    | 'CAT'
    | 'LIVRET_A'
    | 'LDDS'
    | 'COMPTE_COURANT';

/**
 * One envelope row of the cascade, as edited in the form. A subset of
 * EnvelopeConfigData's fields — terRate, brokerageFeeRate, custodyFeeRate,
 * custodyFeeFixedMonthly, arbitrageFeeRate, arbitrageFeeFixed, isUncapped
 * and customTaxRate all default to 0/false/null server-side
 * (RunMultiEnvelopeSimulationRequest::toData()), the same simplification
 * SingleEnvelopeSimulator already makes over the package's full fee model.
 */
export interface EnvelopeFormValues {
    accountType: AccountType;
    initialAmount: number;
    monthlyContribution: number;
    durationYears: number;
    annualReturnRate: number;
    managementFeeRate: number;
}

export type EnvelopeFormDefaults = Omit<EnvelopeFormValues, 'accountType'>;

/**
 * Values actually submitted by the form. inflationRate is shared by the
 * whole cascade rather than repeated per envelope: only
 * envelopeConfigs[0]->inflationRate is ever read by the engine
 * (docs/API.md §2), so asking per row would let rows silently disagree
 * with no effect.
 */
export interface MultiEnvelopeFormValues {
    name: string;
    inflationRate: number;
    envelopes: EnvelopeFormValues[];
}

export interface MultiEnvelopeSimulatorPageProps {
    defaults: EnvelopeFormDefaults & { inflationRate: number };
    accountTypes: AccountType[];
}

/** Mirrors App\Modules\SimulationEngine\Enums\TaxRegime (6 cases). */
export type TaxRegime =
    | 'FLAT_TAX'
    | 'PROGRESSIVE_SCALE'
    | 'LIFE_INSURANCE_REDUCED'
    | 'SOCIAL_LEVIES_ONLY'
    | 'EXEMPT'
    | 'CUSTOM_RATE';

/**
 * Full mirror of PocketResultData
 * (app/Modules/MultiEnvelopeSimulator/Support/MultiEnvelopeScenarioPayload.php),
 * one per envelope of the cascade — every field the payload carries, so the
 * result view can show the full detail per pocket (deposits, the 5 fee
 * categories, taxation, result).
 */
export interface MultiEnvelopePocketResult {
    accountType: AccountType;
    initialDeposit: number;
    dcaDeposited: number;
    totalDeposited: number;
    dcaMonthsCount: number;
    lastDcaAmount: number;
    firstResidualDcaAmount: number;
    ceilingReachedMonth: number | null;
    grossBalance: number;
    totalGains: number;
    taxesAmount: number;
    incomeTaxAmount: number;
    socialLeviesAmount: number;
    taxRegime: TaxRegime;
    netBalance: number;
    brokerageFeesAmount: number;
    managementFeesAmount: number;
    terImpactAmount: number;
    custodyFeesAmount: number;
    arbitrageFeesAmount: number;
    totalFeesAmount: number;
}

export interface MultiEnvelopeYearlyResult {
    year: number;
    totalDeposited: number;
    grossBalance: number;
    netBalance: number;
    realNetBalanceWithInflation: number;
}

export interface MultiEnvelopeScenarioResult {
    summary: MultiEnvelopeYearlyResult;
    yearlyBreakdown: MultiEnvelopeYearlyResult[];
    pockets: MultiEnvelopePocketResult[];
}
