import type { ChartSeries } from '@/features/public-calculator/types';

/** ISO 4217 code used to format every amount displayed by the public calculator. */
export const CURRENCY = 'EUR';

/** Locale used when i18next has not resolved one yet. */
export const FALLBACK_LOCALE = 'fr';

/** Digits kept by the two currency formatters. */
export const CURRENCY_FRACTION_DIGITS = 0;
export const COMPACT_CURRENCY_FRACTION_DIGITS = 1;

/** Growth chart series, in stacking order. */
export const CHART_SERIES: ChartSeries[] = [
    { key: 'contributions', labelKey: 'chart.contributions', color: '#64748B' },
    { key: 'gross', labelKey: 'chart.gross', color: '#8B5CF6' },
    { key: 'netReal', labelKey: 'chart.netReal', color: '#10B981' },
    { key: 'netRealAdjusted', labelKey: 'chart.netRealAdjusted', color: '#F97316', dashed: true },
];

/** Headroom added above the highest plotted value before rounding up the Y axis. */
export const Y_AXIS_MARGIN_RATIO = 0.05;

/** Y axis rounds up to this step below the threshold, and to the larger one above it. */
export const Y_AXIS_SMALL_STEP = 10_000;
export const Y_AXIS_LARGE_STEP = 50_000;
export const Y_AXIS_STEP_THRESHOLD = 200_000;
