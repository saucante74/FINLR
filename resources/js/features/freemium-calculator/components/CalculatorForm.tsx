import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buildCompoundInputsSchema } from '@/features/freemium-calculator/lib/validation';
import type { CompoundInputs, TaxSuggestion } from '@/features/freemium-calculator/types';
import { cn } from '@/lib/utils';

interface FieldProps {
    id: string;
    label: string;
    unit?: string;
    step?: number;
    min?: number;
    tooltip?: string;
    error?: string;
    registration: UseFormRegisterReturn;
}

function Field({ id, label, unit, step = 1, min = 0, tooltip, error, registration }: FieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id} className="flex items-center gap-1.5">
                {label}
                {tooltip && (
                    <span title={tooltip} className="inline-flex shrink-0 text-muted-foreground">
                        <Info className="size-3.5" />
                    </span>
                )}
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    step={step}
                    min={min}
                    aria-invalid={Boolean(error)}
                    className={cn(unit && 'pr-10', 'tabular-nums')}
                    {...registration}
                />
                {unit && (
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                        {unit}
                    </span>
                )}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

interface CalculatorFormProps {
    inputs: CompoundInputs;
    onChange: (partial: Partial<CompoundInputs>) => void;
    taxSuggestions: TaxSuggestion[];
}

export default function CalculatorForm({ inputs, onChange, taxSuggestions }: CalculatorFormProps) {
    const { t } = useTranslation();
    const schema = useMemo(() => buildCompoundInputsSchema(t), [t]);

    const {
        register,
        watch,
        setValue,
        formState: { errors, touchedFields },
    } = useForm<CompoundInputs>({
        resolver: zodResolver(schema),
        defaultValues: inputs,
        mode: 'onChange',
    });

    // Propagate each field to the parent (and trigger a recompute) the
    // instant it validates, independently of react-hook-form's own async
    // validation cycle so there is no race between the two.
    useEffect(() => {
        const subscription = watch((values, { name, type }) => {
            if (!name || type !== 'change') return;

            const fieldSchema = schema.shape[name];
            const parsed = fieldSchema.safeParse(values[name]);

            if (parsed.success) {
                onChange({ [name]: parsed.data } as Partial<CompoundInputs>);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, schema, onChange]);

    const liveYears = watch('years');

    const handleTaxSuggestionClick = (rate: number) => {
        setValue('taxRate', rate, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        onChange({ taxRate: rate });
    };

    const errorFor = (id: keyof CompoundInputs): string | undefined =>
        touchedFields[id] ? errors[id]?.message : undefined;

    return (
        <Card className="h-full gap-0 py-0">
            <CardHeader className="border-b border-border py-5">
                <CardTitle className="text-base">{t('form.title')}</CardTitle>
                <CardDescription>{t('form.description')}</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6 py-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        id="initialCapital"
                        label={t('form.initialCapital')}
                        unit={t('form.currencyUnit')}
                        step={100}
                        error={errorFor('initialCapital')}
                        registration={register('initialCapital', { valueAsNumber: true })}
                    />
                    <Field
                        id="monthlyContribution"
                        label={t('form.monthlyContribution')}
                        unit={t('form.currencyUnit')}
                        step={50}
                        error={errorFor('monthlyContribution')}
                        registration={register('monthlyContribution', { valueAsNumber: true })}
                    />
                    <Field
                        id="annualRate"
                        label={t('form.annualRate')}
                        unit={t('form.percentUnit')}
                        step={0.1}
                        error={errorFor('annualRate')}
                        registration={register('annualRate', { valueAsNumber: true })}
                    />
                    <Field
                        id="years"
                        label={t('form.years')}
                        unit={t('form.yearsUnit', { count: liveYears })}
                        step={1}
                        min={1}
                        error={errorFor('years')}
                        registration={register('years', { valueAsNumber: true })}
                    />
                </div>

                <section className="flex flex-col gap-4 rounded-lg border border-border bg-muted/40 p-4">
                    <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {t('form.feesTitle')}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            id="wrapperFee"
                            label={t('form.wrapperFee')}
                            unit={t('form.percentUnit')}
                            step={0.1}
                            tooltip={t('form.wrapperFeeInfo')}
                            error={errorFor('wrapperFee')}
                            registration={register('wrapperFee', { valueAsNumber: true })}
                        />
                        <Field
                            id="fundFee"
                            label={t('form.fundFee')}
                            unit={t('form.percentUnit')}
                            step={0.1}
                            tooltip={t('form.fundFeeInfo')}
                            error={errorFor('fundFee')}
                            registration={register('fundFee', { valueAsNumber: true })}
                        />
                    </div>
                </section>

                <section className="flex flex-col gap-4 rounded-lg border border-border bg-muted/40 p-4">
                    <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {t('form.inflationTitle')}
                    </h3>
                    <Field
                        id="inflationRate"
                        label={t('form.inflationRate')}
                        unit={t('form.percentUnit')}
                        step={0.1}
                        error={errorFor('inflationRate')}
                        registration={register('inflationRate', { valueAsNumber: true })}
                    />
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="inflationEnabled"
                            checked={inputs.inflationEnabled}
                            onCheckedChange={(checked) =>
                                onChange({ inflationEnabled: checked === true })
                            }
                        />
                        <Label htmlFor="inflationEnabled" className="text-sm font-normal">
                            {t('form.inflationEnabled')}
                        </Label>
                    </div>
                </section>

                <section className="flex flex-col gap-4 rounded-lg border border-border bg-muted/40 p-4">
                    <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {t('form.taxTitle')}
                    </h3>
                    <Field
                        id="taxRate"
                        label={t('form.taxRate')}
                        unit={t('form.percentUnit')}
                        step={0.1}
                        error={errorFor('taxRate')}
                        registration={register('taxRate', { valueAsNumber: true })}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {t('form.suggestions')}
                        </span>
                        {taxSuggestions.map((s) => {
                            const active = Math.abs(inputs.taxRate - s.rate) < 0.001;
                            return (
                                <button
                                    key={s.wrapper}
                                    type="button"
                                    onClick={() => handleTaxSuggestionClick(s.rate)}
                                    aria-pressed={active}
                                    className={cn(
                                        'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                                        active
                                            ? 'border-brand bg-brand text-brand-foreground'
                                            : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    {t(`form.wrappers.${s.wrapper}`)} {s.rate}
                                    {t('form.percentUnit')}
                                </button>
                            );
                        })}
                    </div>
                </section>
            </CardContent>
        </Card>
    );
}
