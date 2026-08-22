export type TaxWrapper = 'pea' | 'cto';

export type Jurisdiction = 'france';

/**
 * Values actually submitted by the form. The wrapper is deliberately absent:
 * it travels in the URL and is resolved server-side from the route segment,
 * so a forged body field could never override it.
 */
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
}

export type SingleEnvelopeFormDefaults = Omit<SingleEnvelopeFormValues, 'name'>;

export interface SingleEnvelopeSimulatorPageProps {
    defaults: SingleEnvelopeFormDefaults;
    jurisdiction: Jurisdiction;
    wrapper: TaxWrapper;
}

export interface ChooseWrapperPageProps {
    jurisdiction: Jurisdiction;
    wrappers: TaxWrapper[];
}
