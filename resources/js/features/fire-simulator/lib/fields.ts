import type { FireSimulatorDefaults } from '@/features/fire-simulator/types';

export type FieldKey = keyof FireSimulatorDefaults;

interface AmountFieldConfig {
    control: 'amount';
    step: number;
}

interface SliderFieldConfig {
    control: 'slider';
    unit: 'percent' | 'years';
    step: number;
    min: number;
    max: number;
}

export type FieldConfig = AmountFieldConfig | SliderFieldConfig;

/**
 * Presentational control for each of the 6 fields of FireProjectionInput.
 * Keyed on FireSimulatorDefaults itself, so adding or removing a field there
 * fails the typecheck here until this table follows — same guarantee as
 * Analogy's own SHARED_FIELD_CONFIG. These min/max bounds are this
 * application's UI affordance only: the package validates its own
 * invariants at construction (docs/API.md §4), so RunFireProjectionRequest
 * deliberately does not mirror these bounds server-side.
 */
export const FIELD_CONFIG: Record<FieldKey, FieldConfig> = {
    currentAge: { control: 'slider', unit: 'years', step: 1, min: 18, max: 99 },
    currentCapital: { control: 'amount', step: 500 },
    monthlyContribution: { control: 'amount', step: 50 },
    annualReturnRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 15 },
    desiredAnnualIncome: { control: 'amount', step: 500 },
    withdrawalRate: { control: 'slider', unit: 'percent', step: 0.1, min: 1, max: 10 },
};

/** Display order of the form's 6 fields. */
export const FIELD_ORDER: FieldKey[] = [
    'currentAge',
    'currentCapital',
    'monthlyContribution',
    'annualReturnRate',
    'desiredAnnualIncome',
    'withdrawalRate',
];
