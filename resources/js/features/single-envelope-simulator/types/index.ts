export type TaxWrapper = 'pea' | 'cto';

export interface SingleEnvelopeFormValues {
    name: string;
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

export type SingleEnvelopeFormDefaults = Omit<SingleEnvelopeFormValues, 'name'>;

export interface SingleEnvelopeSimulatorPageProps {
    defaults: SingleEnvelopeFormDefaults;
}
