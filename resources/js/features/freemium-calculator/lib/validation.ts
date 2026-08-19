import type { TFunction } from 'i18next';
import { z } from 'zod';

/**
 * Zod schema for the public calculator form. Built from a translation
 * function rather than declared at module scope, so the error messages
 * follow the active language and update when it changes.
 */
export function buildCompoundInputsSchema(t: TFunction) {
    const nonNegativeAmount = () =>
        z.number(t('form.errors.invalidNumber')).nonnegative(t('form.errors.negative'));

    const percent = () =>
        z
            .number(t('form.errors.invalidNumber'))
            .min(0, t('form.errors.percentRange'))
            .max(100, t('form.errors.percentRange'));

    return z.object({
        initialCapital: nonNegativeAmount(),
        monthlyContribution: nonNegativeAmount(),
        annualRate: percent(),
        years: z
            .number(t('form.errors.invalidNumber'))
            .int(t('form.errors.yearsRange'))
            .min(1, t('form.errors.yearsRange'))
            .max(60, t('form.errors.yearsRange')),
        wrapperFee: percent(),
        fundFee: percent(),
        taxRate: percent(),
        inflationRate: percent(),
        inflationEnabled: z.boolean(),
    });
}

export type CompoundInputsSchema = ReturnType<typeof buildCompoundInputsSchema>;
