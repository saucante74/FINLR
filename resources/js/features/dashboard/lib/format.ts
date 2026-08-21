import { FALLBACK_LOCALE } from '@/lib/currency';

export function formatDate(value: string | null, locale = FALLBACK_LOCALE): string {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
}
