import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    Jurisdiction,
    SingleEnvelopeFormDefaults,
    SingleEnvelopeFormValues,
    TaxWrapper,
} from '@/features/single-envelope-simulator/types';

interface NumberFieldProps {
    id: keyof Omit<SingleEnvelopeFormValues, 'inflationEnabled' | 'name'>;
    label: string;
    value: number;
    step?: number;
    min?: number;
    error?: string;
    onChange: (value: number) => void;
}

function NumberField({ id, label, value, step = 1, min = 0, error, onChange }: NumberFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={id}
                type="number"
                inputMode="decimal"
                step={step}
                min={min}
                value={value}
                aria-invalid={Boolean(error)}
                onChange={(e) => onChange(Number(e.target.value))}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

interface SingleEnvelopeFormProps {
    defaults: SingleEnvelopeFormDefaults;
    jurisdiction: Jurisdiction;
    wrapper: TaxWrapper;
}

export default function SingleEnvelopeForm({ defaults, jurisdiction, wrapper }: SingleEnvelopeFormProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm<SingleEnvelopeFormValues>({
        ...defaults,
        name: '',
    });

    // Not a field of SingleEnvelopeFormValues: flashed by the controller
    // when the calculation itself fails, so it isn't tied to any one input.
    const simulationError = (errors as Record<string, string | undefined>).simulation;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('simulators.single-envelope.run', { jurisdiction, wrapper }));
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            {simulationError && (
                <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {simulationError}
                </p>
            )}

            <div className="flex flex-col gap-2">
                <Label htmlFor="name">{t('simulator.singleEnvelope.form.name')}</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    maxLength={255}
                    value={data.name}
                    aria-invalid={Boolean(errors.name)}
                    onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                    id="initialCapital"
                    label={t('simulator.singleEnvelope.form.initialCapital')}
                    value={data.initialCapital}
                    step={100}
                    error={errors.initialCapital}
                    onChange={(value) => setData('initialCapital', value)}
                />
                <NumberField
                    id="monthlyContribution"
                    label={t('simulator.singleEnvelope.form.monthlyContribution')}
                    value={data.monthlyContribution}
                    step={50}
                    error={errors.monthlyContribution}
                    onChange={(value) => setData('monthlyContribution', value)}
                />
                <NumberField
                    id="annualRate"
                    label={t('simulator.singleEnvelope.form.annualRate')}
                    value={data.annualRate}
                    step={0.1}
                    error={errors.annualRate}
                    onChange={(value) => setData('annualRate', value)}
                />
                <NumberField
                    id="years"
                    label={t('simulator.singleEnvelope.form.years')}
                    value={data.years}
                    step={1}
                    min={1}
                    error={errors.years}
                    onChange={(value) => setData('years', value)}
                />
                <NumberField
                    id="wrapperFee"
                    label={t('simulator.singleEnvelope.form.wrapperFee')}
                    value={data.wrapperFee}
                    step={0.1}
                    error={errors.wrapperFee}
                    onChange={(value) => setData('wrapperFee', value)}
                />
                <NumberField
                    id="fundFee"
                    label={t('simulator.singleEnvelope.form.fundFee')}
                    value={data.fundFee}
                    step={0.1}
                    error={errors.fundFee}
                    onChange={(value) => setData('fundFee', value)}
                />
                <NumberField
                    id="taxRate"
                    label={t('simulator.singleEnvelope.form.taxRate')}
                    value={data.taxRate}
                    step={0.1}
                    error={errors.taxRate}
                    onChange={(value) => setData('taxRate', value)}
                />
                <NumberField
                    id="inflationRate"
                    label={t('simulator.singleEnvelope.form.inflationRate')}
                    value={data.inflationRate}
                    step={0.1}
                    error={errors.inflationRate}
                    onChange={(value) => setData('inflationRate', value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="inflationEnabled"
                    checked={data.inflationEnabled}
                    onCheckedChange={(checked) => setData('inflationEnabled', checked === true)}
                />
                <Label htmlFor="inflationEnabled" className="font-normal">
                    {t('simulator.singleEnvelope.form.inflationEnabled')}
                </Label>
            </div>

            {/* Read-only: the wrapper is fixed by the URL, not a form field. */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">{t('simulator.singleEnvelope.form.wrapper')}</span>
                <span className="inline-flex w-fit items-center rounded-full border border-brand/25 bg-brand/8 px-3 py-1.5 text-sm font-medium text-brand">
                    {t(`simulator.singleEnvelope.form.wrapperOptions.${wrapper}`)}
                </span>
            </div>

            <Button type="submit" variant="brand" disabled={processing}>
                {t('simulator.singleEnvelope.form.submit')}
            </Button>
        </form>
    );
}
