import type { EnvelopeFormDefaults } from '@/features/multi-envelope-simulator/types';

export type EnvelopeFieldKey = keyof EnvelopeFormDefaults;

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

export type EnvelopeFieldConfig = AmountFieldConfig | SliderFieldConfig;

/**
 * Presentational control for every per-envelope field the form exposes.
 * Keyed on EnvelopeFormDefaults itself, so adding or removing a field there
 * fails the typecheck here until this table follows — same guarantee as
 * single-envelope-simulator's own FORM_FIELD_CONFIG.
 */
export const ENVELOPE_FIELD_CONFIG: Record<EnvelopeFieldKey, EnvelopeFieldConfig> = {
    initialAmount: { control: 'amount', step: 100 },
    monthlyContribution: { control: 'amount', step: 50 },
    durationYears: { control: 'slider', unit: 'years', step: 1, min: 1, max: 40 },
    annualReturnRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 15 },
    managementFeeRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 3 },
};

/** Display order of the per-envelope fields within a row. */
export const ENVELOPE_FIELD_ORDER: EnvelopeFieldKey[] = [
    'initialAmount',
    'monthlyContribution',
    'durationYears',
    'annualReturnRate',
    'managementFeeRate',
];
