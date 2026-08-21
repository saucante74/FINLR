import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SingleEnvelopeFormValues, TaxWrapper } from '@/features/single-envelope-simulator/types';

const WRAPPER_OPTIONS: TaxWrapper[] = ['pea', 'cto'];

interface NumberFieldProps {
    id: keyof Omit<SingleEnvelopeFormValues, 'inflationEnabled' | 'wrapper'>;
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
    defaults: SingleEnvelopeFormValues;
}

export default function SingleEnvelopeForm({ defaults }: SingleEnvelopeFormProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm<SingleEnvelopeFormValues>(defaults);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('simulators.single-envelope.run'));
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
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

            <div className="flex flex-col gap-2">
                <Label htmlFor="wrapper">{t('simulator.singleEnvelope.form.wrapper')}</Label>
                <Select value={data.wrapper} onValueChange={(value) => setData('wrapper', value as TaxWrapper)}>
                    <SelectTrigger id="wrapper" aria-invalid={Boolean(errors.wrapper)} className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {WRAPPER_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                                {t(`simulator.singleEnvelope.form.wrapperOptions.${option}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.wrapper && <p className="text-xs text-destructive">{errors.wrapper}</p>}
            </div>

            <Button type="submit" variant="brand" disabled={processing}>
                {t('simulator.singleEnvelope.form.submit')}
            </Button>
        </form>
    );
}
