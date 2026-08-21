/**
 * Currency formatting shared across every feature: not business logic
 * specific to a domain (unlike e.g. chart colors or axis steps), just the
 * application's single currency/locale convention.
 */

/** ISO 4217 code used to format every amount displayed across the app. */
export const CURRENCY = 'EUR';

/** Locale used when i18next has not resolved one yet. */
export const FALLBACK_LOCALE = 'fr';

/** Digits kept by the standard currency formatter. */
export const CURRENCY_FRACTION_DIGITS = 0;

/** Digits kept by the compact currency formatter (e.g. chart axis ticks). */
export const COMPACT_CURRENCY_FRACTION_DIGITS = 1;

export function formatCurrency(value: number, locale = FALLBACK_LOCALE): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: CURRENCY,
        maximumFractionDigits: CURRENCY_FRACTION_DIGITS,
    }).format(Number.isFinite(value) ? value : 0);
}

export function formatCompact(value: number, locale = FALLBACK_LOCALE): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: CURRENCY,
        notation: 'compact',
        maximumFractionDigits: COMPACT_CURRENCY_FRACTION_DIGITS,
    }).format(Number.isFinite(value) ? value : 0);
}
