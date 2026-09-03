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

/**
 * Minimal mirror of the fields MultiEnvelopeScenarioSummary actually
 * displays from MultiEnvelopeCalculationResultData's stored payload
 * (app/Modules/MultiEnvelopeSimulator/Support/MultiEnvelopeScenarioPayload.php)
 * — not every field the payload carries, only the ones this first,
 * minimal result view renders.
 */
export interface MultiEnvelopePocketResult {
    accountType: AccountType;
    totalDeposited: number;
    netBalance: number;
    taxRegime: string;
}

export interface MultiEnvelopeYearlyResult {
    year: number;
    totalDeposited: number;
    netBalance: number;
    realNetBalanceWithInflation: number;
}

export interface MultiEnvelopeScenarioResult {
    summary: MultiEnvelopeYearlyResult;
    pockets: MultiEnvelopePocketResult[];
}
