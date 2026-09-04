/**
 * Values submitted by the form — flat, matching RunFireProjectionRequest's
 * own field names exactly, since Inertia's useForm posts this shape as-is.
 * No enveloppe, no shared-vs-per-scenario split (unlike Analogy): FIRE is a
 * single block of 6 fields (docs/API.md §4).
 */
export interface FireFormValues {
    name: string;
    currentAge: number;
    currentCapital: number;
    monthlyContribution: number;
    annualReturnRate: number;
    desiredAnnualIncome: number;
    withdrawalRate: number;
}

/** Mirrors App\Modules\FireSimulator\DTOs\SimulatorDefaultsData::toArray(). */
export interface FireSimulatorDefaults {
    currentAge: number;
    currentCapital: number;
    monthlyContribution: number;
    annualReturnRate: number;
    desiredAnnualIncome: number;
    withdrawalRate: number;
}

export interface FireSimulatorPageProps {
    defaults: FireSimulatorDefaults;
}

/**
 * Mirror of App\Modules\SimulationEngine\DTOs\FireScenarioResultData — one
 * complete FIRE projection for a given withdrawal rate, reused for the base
 * projection and for each of the three named scenarios below.
 */
export interface FireProjectionScenario {
    requiredCapital: number;
    retirementAge: number | null;
    yearsToRetirement: number | null;
}

/**
 * Mirror of the fields FireScenarioSummary actually displays from
 * FireProjectionResultData's stored payload
 * (app/Modules/FireSimulator/Support/FireScenarioPayload.php).
 * `requiredCapital` is always present; `retirementAge`/`yearsToRetirement`
 * are `null` only when the target is never reached within the package's
 * internal horizon (docs/API.md §4) — never when it is already met (that
 * case yields the current age and `0`, never `null`).
 */
export interface FireScenarioResult {
    requiredCapital: number;
    retirementAge: number | null;
    yearsToRetirement: number | null;
    optimistic: FireProjectionScenario;
    neutral: FireProjectionScenario;
    pessimistic: FireProjectionScenario;
}
