import type { AnalogyScenarioResult } from '@/features/analogy-simulator/types';
import type { MultiEnvelopeScenarioResult } from '@/features/multi-envelope-simulator/types';

export type TaxWrapper = 'pea' | 'cto' | 'av';

export type CalculatorType = 'single_envelope' | 'multi_envelope' | 'analogy';

export interface ScenarioInput {
    initialCapital: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
    wrapperFee: number;
    fundFee: number;
    taxRate: number;
    inflationRate: number;
    inflationEnabled: boolean;
    wrapper: TaxWrapper;
}

export interface ScenarioResultPoint {
    year: number;
    contributions: number;
    gross: number;
    netReal: number;
    netRealAdjusted: number;
}

export interface ScenarioResult {
    points: ScenarioResultPoint[];
    invested: number;
    grossGains: number;
    finalGross: number;
    netRealGains: number;
    finalNetReal: number;
    finalNetRealAdjusted: number;
    shortfall: number;
}

export interface ScenarioProps {
    id: number;
    input: ScenarioInput;
    result: ScenarioResult | MultiEnvelopeScenarioResult | AnalogyScenarioResult;
    calculatorType: CalculatorType;
    createdAt: string;
    name: string | null;
}

/** The numeric series of a ScenarioResultPoint that the chart can plot. */
export type ScenarioChartSeriesKey = 'contributions' | 'gross' | 'netReal' | 'netRealAdjusted';

export interface ScenarioChartSeries {
    key: ScenarioChartSeriesKey;
    labelKey: string;
    color: string;
    dashed?: boolean;
}
