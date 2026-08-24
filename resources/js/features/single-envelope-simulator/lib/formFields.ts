import type { SingleEnvelopeFormDefaults } from '@/features/single-envelope-simulator/types';

export type FormFieldKey = keyof SingleEnvelopeFormDefaults;

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

interface CheckboxFieldConfig {
    control: 'checkbox';
}

export type FormFieldConfig = AmountFieldConfig | SliderFieldConfig | CheckboxFieldConfig;

/**
 * Presentational control for every field the engine's input actually has —
 * SingleEnvelopeFormDefaults mirrors CalculationInputData minus the wrapper,
 * which travels in the URL instead. Keyed on that type itself, so adding or
 * removing a field there fails the typecheck here until this table follows:
 * the field list a simulation needs is never hand-copied from one wrapper's
 * mockup, it comes from what the engine's input actually is.
 */
export const FORM_FIELD_CONFIG: Record<FormFieldKey, FormFieldConfig> = {
    initialCapital: { control: 'amount', step: 100 },
    monthlyContribution: { control: 'amount', step: 50 },
    years: { control: 'slider', unit: 'years', step: 1, min: 1, max: 40 },
    annualRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 15 },
    wrapperFee: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 3 },
    fundFee: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 3 },
    taxRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 50 },
    inflationRate: { control: 'slider', unit: 'percent', step: 0.1, min: 0, max: 10 },
    inflationEnabled: { control: 'checkbox' },
};

export interface FormSection {
    titleKey: string;
    fields: FormFieldKey[];
}

/**
 * Layout grouping only — which section of the form each field appears
 * under, and in what order. Every key of FORM_FIELD_CONFIG must appear
 * exactly once across these arrays (checked in formFields.test.ts).
 */
export const FORM_SECTIONS: FormSection[] = [
    { titleKey: 'capital', fields: ['initialCapital', 'monthlyContribution', 'years'] },
    { titleKey: 'performance', fields: ['annualRate', 'wrapperFee', 'fundFee'] },
    { titleKey: 'taxation', fields: ['taxRate', 'inflationRate', 'inflationEnabled'] },
];

/**
 * Groups consecutive 'amount' fields so the caller can lay them out
 * side-by-side (as the mockup does for capital/monthly contribution),
 * while every other field stays its own full-width row. Pure layout
 * derived from FORM_FIELD_CONFIG's control kind, not from field names.
 */
export function groupFieldsForLayout(fields: FormFieldKey[]): FormFieldKey[][] {
    const groups: FormFieldKey[][] = [];

    for (const field of fields) {
        const previousGroup = groups[groups.length - 1] as FormFieldKey[] | undefined;
        const isAmount = FORM_FIELD_CONFIG[field].control === 'amount';
        const previousIsAmount =
            previousGroup !== undefined && FORM_FIELD_CONFIG[previousGroup[0]].control === 'amount';

        if (isAmount && previousIsAmount) {
            previousGroup.push(field);
        } else {
            groups.push([field]);
        }
    }

    return groups;
}
