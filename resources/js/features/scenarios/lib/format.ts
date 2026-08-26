import { FALLBACK_LOCALE } from '@/lib/currency';

export function formatDate(value: string, locale = FALLBACK_LOCALE): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
}
