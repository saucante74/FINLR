import { Flame, Layers, PiggyBank, Scale, type LucideIcon } from 'lucide-react';

import type { CalculatorType, SimulatorKey } from '@/features/dashboard/types';

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

/**
 * The icon representing each simulator — the single source of truth for
 * both the dashboard's fixed simulator cards and the /simulators full
 * list, so the two pages can never show a different icon for the same
 * simulator.
 */
export const SIMULATOR_ICONS: Record<SimulatorKey, LucideIcon> = {
    singleEnvelope: PiggyBank,
    multiEnvelope: Layers,
    analogy: Scale,
    fire: Flame,
};
