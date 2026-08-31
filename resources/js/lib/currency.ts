/**
 * Currency formatting shared across every feature: not business logic
 * specific to a domain (unlike e.g. chart colors or axis steps), just the
 * application's single currency/locale convention.
 */

export interface SupportedCurrency {
    /** ISO 4217 code. */
    code: string;
    /** Symbol or code shown next to the currency in pickers. */
    symbol: string;
}

/**
 * Every currency the UI can present, e.g. in a display-currency picker.
 * Only the first one is currently wired into formatting (see `CURRENCY`
 * below) — the rest are listed so the picker can show them as options
 * before the app actually supports switching between them.
 */
export const CURRENCIES: readonly SupportedCurrency[] = [
    { code: 'EUR', symbol: '€' },
    { code: 'CHF', symbol: 'CHF' },
    { code: 'USD', symbol: '$' },
];

/** ISO 4217 code used to format every amount displayed across the app. */
export const CURRENCY: SupportedCurrency['code'] = CURRENCIES[0].code;

/**
 * Renders a currency picker option as "symbol — name (CODE)", or
 * "CODE — name" when the symbol is just the ISO code repeated (e.g. CHF),
 * to avoid duplicating it.
 */
export function formatCurrencyOption(
    { code, symbol }: SupportedCurrency,
    name: string,
): string {
    return code === symbol ? `${code} — ${name}` : `${symbol} — ${name} (${code})`;
}

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
