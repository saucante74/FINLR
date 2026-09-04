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

/** Mirrors App\Modules\SimulationEngine\Enums\AnalogyLeader (3 cases). */
export type AnalogyLeader = 'SCENARIO_A' | 'SCENARIO_B' | 'TIE';

/**
 * Values shared by both scenarios — asked once, per
 * AnalogyComparisonInputData's own docblock (docs/API.md §3): the
 * comparison only makes sense at equal initial amount, DCA and duration,
 * a guarantee the package itself cannot enforce, so the form makes
 * divergence impossible by construction instead of asking twice. A subset
 * of the fields AnalogyComparisonInputData accepts — same simplification
 * as MultiEnvelopeSimulator's own form (Étape 2): terRate,
 * brokerageFeeRate, custodyFeeRate, custodyFeeFixedMonthly,
 * arbitrageFeeRate, arbitrageFeeFixed default to 0 server-side
 * (RunAnalogyComparisonRequest::toData()).
 */
export interface AnalogySharedFormValues {
    initialAmount: number;
    monthlyContribution: number;
    durationYears: number;
    annualReturnRate: number;
    managementFeeRate: number;
    inflationRate: number;
}

/**
 * Values actually submitted by the form — flat, matching
 * RunAnalogyComparisonRequest's own field names exactly
 * (accountTypeA/labelA/accountTypeB/labelB, not a nested "scenarioA"
 * object), since Inertia's useForm posts this shape as-is.
 */
export interface AnalogyFormValues extends AnalogySharedFormValues {
    name: string;
    accountTypeA: AccountType;
    labelA: string;
    accountTypeB: AccountType;
    labelB: string;
}

export interface AnalogySimulatorPageProps {
    defaults: AnalogySharedFormValues;
    accountTypes: AccountType[];
}

/**
 * Mirror of the fields AnalogyScenarioSummary actually displays from
 * AnalogyResultData's stored payload
 * (app/Modules/AnalogySimulator/Support/AnalogyScenarioPayload.php) — not
 * every field the payload carries, only the ones this result view renders.
 */
export interface AnalogyDelta {
    valueA: number;
    valueB: number;
    absolute: number;
    percent: number | null;
}

export interface CeilingEvent {
    accountType: AccountType;
    ceiling: number | null;
    year: number;
    isReachedOnInitialDeposit: boolean;
}

export interface AnalogyYearlyPoint {
    year: number;
    netBalance: AnalogyDelta;
    realNetBalanceWithInflation: AnalogyDelta;
    totalDeposited: AnalogyDelta;
    leader: AnalogyLeader;
    ceilingEventsA: CeilingEvent[];
    ceilingEventsB: CeilingEvent[];
    hasCeilingEvent: boolean;
}

export interface AnalogyScenarioResult {
    labelA: string;
    labelB: string;
    realNetBalanceWithInflation: AnalogyDelta;
    netBalance: AnalogyDelta;
    totalGains: AnalogyDelta;
    taxesAmount: AnalogyDelta;
    totalFees: AnalogyDelta;
    totalDeposited: AnalogyDelta;
    yearlyBreakdown: AnalogyYearlyPoint[];
    finalLeader: AnalogyLeader;
    crossoverYears: number[];
    hasCrossover: boolean;
}
