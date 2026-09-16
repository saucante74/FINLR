import type {
    FaqKey,
    FreePlanFeatureKey,
    LandingSectionId,
    MethodStepKey,
    PremiumPlanFeatureKey,
    ProblemKey,
    SimulatorHighlightKey,
} from '@/features/landing/types';

/**
 * The sections the header nav scrolls to, in display order — the single
 * source of truth shared by the nav links and the `id` each section
 * renders, so a renamed anchor can never leave a dead nav link behind.
 */
export const NAV_SECTION_IDS: readonly LandingSectionId[] = [
    'why',
    'simulators',
    'pricing',
    'faq',
];

export const PROBLEM_KEYS: readonly ProblemKey[] = ['taxation', 'tools', 'retirement'];

export const SIMULATOR_HIGHLIGHT_KEYS: readonly SimulatorHighlightKey[] = [
    'classic',
    'comparator',
    'fire',
];

export const METHOD_STEP_KEYS: readonly MethodStepKey[] = [
    'describe',
    'adjust',
    'visualize',
];

export const FREE_PLAN_FEATURE_KEYS: readonly FreePlanFeatureKey[] = [
    'classicSimulator',
    'savedScenarios',
    'history',
    'pdfExport',
];

export const PREMIUM_PLAN_FEATURE_KEYS: readonly PremiumPlanFeatureKey[] = [
    'allSimulators',
    'unlimitedScenarios',
    'comparator',
    'pdfExport',
];

export const FAQ_KEYS: readonly FaqKey[] = [
    'security',
    'cancel',
    'difference',
    'accuracy',
    'beginner',
];

/** Horizon, in years, of the illustrative projection drawn in the hero card. */
export const HERO_PROJECTION_YEARS = 20;

/** Number of year ticks under the hero chart (first, middle, last). */
export const HERO_PROJECTION_TICKS = 3;

/**
 * Relative heights, in percent, of the hero chart bars. These are a purely
 * decorative shape lifted from the mockup: they are NOT a computed
 * projection, and no financial formula is involved (the real projections
 * live in the simulators, backed by saucante74/finlr-engine).
 */
export const HERO_CHART_BARS: readonly number[] = [
    4, 6, 8, 10, 13, 16, 19, 23, 27, 32, 37, 43, 49, 56, 64, 72, 81, 90, 95, 100,
];
