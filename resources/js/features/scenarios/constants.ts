import type { AccountType } from '@/features/multi-envelope-simulator/types';
import type { ScenarioChartSeries } from '@/features/scenarios/types';

/** Scenario chart series, in stacking order. */
export const SCENARIO_CHART_SERIES: ScenarioChartSeries[] = [
    { key: 'contributions', labelKey: 'scenario.chart.contributions', color: '#64748B' },
    { key: 'gross', labelKey: 'scenario.chart.gross', color: '#8B5CF6' },
    { key: 'netReal', labelKey: 'scenario.chart.netReal', color: '#10B981' },
    { key: 'netRealAdjusted', labelKey: 'scenario.chart.netRealAdjusted', color: '#F97316', dashed: true },
];

/**
 * FIRE scenario comparison bars (FireScenarioSummary): optimistic/neutral/
 * pessimistic read as a polarity (best case -> reference -> worst case), not
 * an arbitrary category, so the same green/violet/orange already used for
 * netReal/gross/netRealAdjusted above are reused here for the same "good ->
 * neutral -> harsher" reading, rather than introducing a fourth ad hoc set.
 */
export const FIRE_SCENARIO_BAR_COLORS: Record<'optimistic' | 'neutral' | 'pessimistic', string> = {
    optimistic: '#10B981',
    neutral: '#8B5CF6',
    pessimistic: '#F97316',
};

/**
 * Analogy comparison chart (AnalogyChart): scenario A / scenario B are two
 * arbitrary user-named scenarios, not an ordered polarity like FIRE's
 * optimistic/neutral/pessimistic above — but reusing the same established
 * green/orange pair (already netReal/netRealAdjusted, and
 * optimistic/pessimistic in FIRE_SCENARIO_BAR_COLORS) keeps one consistent
 * "first vs. second thing being compared" visual language across the app,
 * rather than introducing a third ad hoc 2-color set.
 */
export const ANALOGY_CHART_COLORS: Record<'A' | 'B', string> = {
    A: '#10B981',
    B: '#F97316',
};

/**
 * Multi-envelope final-balance-by-envelope chart (MultiEnvelopeScenarioSummary):
 * one bar per pocket, colored by AccountType. 8 account types, 8 fixed slots
 * — an exact match for the dataviz reference palette's 8-hue categorical
 * order, validated for adjacent-pair colorblind safety on bar charts
 * specifically (worst adjacent CVD Delta-E 9.1 light / 8.4 dark, both above
 * the >=8 target). Assigned once, in AccountType's declared order, and never
 * reassigned/recycled — an account type always renders in the same color
 * across scenarios.
 */
export const ACCOUNT_TYPE_CHART_COLORS: Record<AccountType, string> = {
    PEA: '#2a78d6',
    PEA_PME: '#eb6834',
    CTO: '#1baf7a',
    ASSURANCE_VIE: '#eda100',
    CAT: '#e87ba4',
    LIVRET_A: '#008300',
    LDDS: '#4a3aa7',
    COMPTE_COURANT: '#e34948',
};

/** Headroom added above the highest plotted value before rounding up the chart's Y axis. */
export const Y_AXIS_MARGIN_RATIO = 0.05;

/** Y axis rounds up to this step below the threshold, and to the larger one above it. */
export const Y_AXIS_SMALL_STEP = 10_000;
export const Y_AXIS_LARGE_STEP = 50_000;
export const Y_AXIS_STEP_THRESHOLD = 200_000;
