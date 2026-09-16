/** Anchor targets of the landing sections, shared by the header nav and the sections themselves. */
export type LandingSectionId = 'why' | 'simulators' | 'pricing' | 'faq';

/** The three obstacles listed in the "problems" section, in display order. */
export type ProblemKey = 'taxation' | 'tools' | 'retirement';

/** The three simulators presented on the landing page — marketing copy only, no route is derived from it. */
export type SimulatorHighlightKey = 'classic' | 'comparator' | 'fire';

/** The three steps of the "method" section, in display order. */
export type MethodStepKey = 'describe' | 'adjust' | 'visualize';

export type FreePlanFeatureKey =
    | 'classicSimulator'
    | 'savedScenarios'
    | 'history'
    | 'pdfExport';

export type PremiumPlanFeatureKey =
    | 'allSimulators'
    | 'unlimitedScenarios'
    | 'comparator'
    | 'pdfExport';

/** The FAQ entries, in display order. The first one is the one opened by default. */
export type FaqKey = 'security' | 'cancel' | 'difference' | 'accuracy' | 'beginner';

/** Mirrors the props of App\Modules\Shared\Controllers\ShowLandingController. */
export interface LandingPageProps {
    canLogin: boolean;
    canRegister: boolean;
}
