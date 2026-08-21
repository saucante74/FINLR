import type { ScenarioChartSeries } from '@/features/scenarios/types';

/** ISO 4217 code used to format every amount displayed on a scenario page. */
export const CURRENCY = 'EUR';

/** Locale used when i18next has not resolved one yet. */
export const FALLBACK_LOCALE = 'fr';

/** Digits kept by the currency formatter. */
export const CURRENCY_FRACTION_DIGITS = 0;

/** Digits kept by the compact currency formatter used on the chart's Y axis. */
export const COMPACT_CURRENCY_FRACTION_DIGITS = 1;

/** Scenario chart series, in stacking order. */
export const SCENARIO_CHART_SERIES: ScenarioChartSeries[] = [
    { key: 'contributions', labelKey: 'scenario.chart.contributions', color: '#64748B' },
    { key: 'gross', labelKey: 'scenario.chart.gross', color: '#8B5CF6' },
    { key: 'netReal', labelKey: 'scenario.chart.netReal', color: '#10B981' },
    { key: 'netRealAdjusted', labelKey: 'scenario.chart.netRealAdjusted', color: '#F97316', dashed: true },
];

/** Headroom added above the highest plotted value before rounding up the chart's Y axis. */
export const Y_AXIS_MARGIN_RATIO = 0.05;

/** Y axis rounds up to this step below the threshold, and to the larger one above it. */
export const Y_AXIS_SMALL_STEP = 10_000;
export const Y_AXIS_LARGE_STEP = 50_000;
export const Y_AXIS_STEP_THRESHOLD = 200_000;
