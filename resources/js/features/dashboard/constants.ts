import type { CalculatorType } from '@/features/dashboard/types';

/**
 * Every calculator type a saved scenario can have, in display order — the
 * single source of truth for the scenario list's type filter. Mirrors the
 * backend CalculatorType enum (App\Modules\Scenarios\Enums\CalculatorType),
 * which every ScenarioSummary.calculatorType value already comes from.
 */
export const CALCULATOR_TYPES: readonly CalculatorType[] = [
    'single_envelope',
    'multi_envelope',
    'analogy',
    'fire',
];
