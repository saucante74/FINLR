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

export interface TaxSuggestion {
    wrapper: string;
    rate: number;
}

export interface PublicCalculatorPageProps {
    canLogin: boolean;
    canRegister: boolean;
}

/** The numeric series of a CompoundPoint that the growth chart can plot. */
export type ChartSeriesKey = 'contributions' | 'gross' | 'netReal' | 'netRealAdjusted';

export interface ChartSeries {
    key: ChartSeriesKey;
    labelKey: string;
    color: string;
    dashed?: boolean;
}
