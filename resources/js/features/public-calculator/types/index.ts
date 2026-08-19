export interface CompoundInputs {
    initialCapital: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
    wrapperFee: number;
    fundFee: number;
    taxRate: number;
    inflationRate: number;
    inflationEnabled: boolean;
}

export interface CompoundPoint {
    year: number;
    contributions: number;
    gross: number;
    netReal: number;
    netRealAdjusted: number;
}

export interface CompoundResult {
    points: CompoundPoint[];
    invested: number;
    grossGains: number;
    finalGross: number;
    netRealGains: number;
    finalNetReal: number;
    finalNetRealAdjusted: number;
    shortfall: number;
}

/** Mirrors App\Modules\PublicCalculator\DTOs\TaxSuggestionData. */
export interface TaxSuggestion {
    wrapper: string;
    rate: number;
}

/** Mirrors App\Modules\PublicCalculator\DTOs\PublicCalculatorSettingsData. */
export interface PublicCalculatorSettings {
    defaults: CompoundInputs;
    taxSuggestions: TaxSuggestion[];
}

export interface PublicCalculatorPageProps {
    canLogin: boolean;
    canRegister: boolean;
    financial: PublicCalculatorSettings;
}

/** The numeric series of a CompoundPoint that the growth chart can plot. */
export type ChartSeriesKey = 'contributions' | 'gross' | 'netReal' | 'netRealAdjusted';

export interface ChartSeries {
    key: ChartSeriesKey;
    labelKey: string;
    color: string;
    dashed?: boolean;
}
