import type { Paginated } from '@/types';

export type CalculatorType = 'single_envelope' | 'multi_envelope' | 'analogy' | 'fire';

// Identifies one of the app's 4 simulators via the same camelCase key as
// its i18n namespace (dashboard.simulators.<key>.*) — the naming/casing
// convention used by UI-facing simulator identity (dashboard cards, the
// /simulators list), as opposed to CalculatorType above, which is the
// snake_case, persisted-scenario version of the same 4 concepts.
export type SimulatorKey = 'singleEnvelope' | 'multiEnvelope' | 'analogy' | 'fire';

export interface ScenarioSummary {
    id: number;
    calculatorType: CalculatorType;
    // i18n key for the "Type" column (CalculatorType::label() on the
    // backend) — never a literal label, so the frontend just passes it to
    // t() and never matches on calculatorType itself.
    typeLabel: string;
    headlineFigure: number;
    createdAt: string | null;
    // Mirrors the backend DTO's plain `string`: legacy scenarios may carry
    // an empty string, or (historically) a wrapper no longer offered.
    wrapper: string;
    years: number;
    name: string | null;
}

export interface DashboardPageProps {
    scenarios: Paginated<ScenarioSummary>;
    // The `type` query param actually applied server-side (null when absent
    // or invalid) — mirrors the value back so the scenario list's filter
    // dropdown stays in sync across pagination/filter round-trips.
    scenarioTypeFilter: CalculatorType | null;
    // One-shot session status, e.g. 'premium-checkout-completed' on return
    // from Stripe Checkout (activation still pending the webhook).
    status: string | null;
}
