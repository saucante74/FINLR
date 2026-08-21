import type { ChartSeries, CompoundInputs, TaxSuggestion } from '@/features/freemium-calculator/types';

/**
 * Tax rates below reflect the same legal reality as the named constants in
 * tests/Unit/SimulationEngine/FinlrEngineAdapterTest.php (PEA/CTO tax rules
 * documented by the private saucante74/finlr-engine package). There is no
 * technical link between the two: the free calculator is deliberately
 * server-free (purely indicative, client-side tool — no PHP logic, no
 * server call), and the private engine has no notion of a Laravel config to
 * read from — its rates are internal to the package. Keeping these two
 * places in sync when the legal rate changes is a manual step; this comment
 * is the reminder for it.
 */

/** PEA capital gains rate, holding period >= 5 years, under the 150,000€ ceiling. */
export const PEA_PREFERENTIAL_RATE_PERCENT = 18.6;

/** PEA capital gains rate outside the preferential conditions (holding period < 5 years or ceiling exceeded). */
export const PEA_STANDARD_RATE_PERCENT = 31.4;

/** CTO capital gains rate, always applicable regardless of holding period. */
export const CTO_RATE_PERCENT = 31.4;

/**
 * Suggested AV (assurance-vie) capital gains rate. The private engine does
 * not model AV as its own wrapper — FinlrEngineAdapter treats it as a CTO —
 * so this value is purely indicative on the free calculator side, with no
 * tested equivalent server-side.
 */
export const AV_SUGGESTED_RATE_PERCENT = 24.7;

/**
 * Default values pre-filled in the calculator form on first render.
 *
 * The public calculator is a purely indicative, client-side tool: it never
 * calls the server to compute or validate anything, so these values live
 * here rather than behind an Inertia prop.
 */
export const FORM_DEFAULTS: CompoundInputs = {
    initialCapital: 10000,
    monthlyContribution: 300,
    annualRate: 7,
    years: 20,
    wrapperFee: 0.5,
    fundFee: 0.3,
    taxRate: PEA_PREFERENTIAL_RATE_PERCENT,
    inflationRate: 2,
    inflationEnabled: false,
};

/** Suggested capital gains tax rate per tax wrapper, in display order. */
export const TAX_SUGGESTIONS: TaxSuggestion[] = [
    { wrapper: 'pea', rate: PEA_PREFERENTIAL_RATE_PERCENT },
    { wrapper: 'av', rate: AV_SUGGESTED_RATE_PERCENT },
    { wrapper: 'cto', rate: CTO_RATE_PERCENT },
];

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
