import { CURRENCY, CURRENCY_FRACTION_DIGITS, FALLBACK_LOCALE } from '@/features/dashboard/constants';

export function formatCurrency(value: number, locale = FALLBACK_LOCALE): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: CURRENCY,
        maximumFractionDigits: CURRENCY_FRACTION_DIGITS,
    }).format(Number.isFinite(value) ? value : 0);
}

export function formatDate(value: string | null, locale = FALLBACK_LOCALE): string {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
}
