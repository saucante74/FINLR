export type TaxWrapper = 'pea' | 'cto' | 'av';

export type CalculatorType = 'single_envelope';

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
    input: ScenarioInput;
    result: ScenarioResult;
    calculatorType: CalculatorType;
    createdAt: string;
}
