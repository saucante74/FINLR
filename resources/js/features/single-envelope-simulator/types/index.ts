export type TaxWrapper = 'pea' | 'cto';

export interface SingleEnvelopeFormValues {
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

export interface SingleEnvelopeSimulatorPageProps {
    defaults: SingleEnvelopeFormValues;
}
