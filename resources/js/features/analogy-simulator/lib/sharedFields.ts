import type { AnalogySharedFormValues } from '@/features/analogy-simulator/types';

export type SharedFieldKey = keyof AnalogySharedFormValues;

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

export type SharedFieldConfig = AmountFieldConfig | SliderFieldConfig;

/**
 * Presentational control for every field of the shared block (asked once,
 * applies to both scenarios). Keyed on AnalogySharedFormValues itself, so
 * adding or removing a field there fails the typecheck here until this
 * table follows — same guarantee as the other simulators' own field
 * config tables.
 */
export const SHARED_FIELD_CONFIG: Record<SharedFieldKey, SharedFieldConfig> = {
    initialAmount: { control: 'amount', step: 100 },
    monthlyContribution: { control: 'amount', step: 50 },
    durationYears: { control: 'slider', unit: 'years', step: 1, min: 1, max: 40 },
    annualReturnRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 15 },
    managementFeeRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 3 },
    inflationRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 10 },
};

/** Display order of the shared fields. */
export const SHARED_FIELD_ORDER: SharedFieldKey[] = [
    'initialAmount',
    'monthlyContribution',
    'durationYears',
    'annualReturnRate',
    'managementFeeRate',
    'inflationRate',
];
