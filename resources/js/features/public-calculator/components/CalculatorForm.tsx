import { Info } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { CompoundInputs, TaxSuggestion } from '@/features/public-calculator/types';

interface FieldProps {
    id: string;
    label: string;
    value: number;
    unit?: string;
    step?: number;
    min?: number;
    tooltip?: string;
    onChange: (value: number) => void;
}

function Field({ id, label, value, unit, step = 1, min = 0, tooltip, onChange }: FieldProps) {
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
                    value={Number.isFinite(value) ? value : ''}
                    step={step}
                    min={min}
                    onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
                    className={cn(unit && 'pr-10', 'tabular-nums')}
                />
                {unit && (
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                        {unit}
                    </span>
                )}
            </div>
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
                        value={inputs.initialCapital}
                        onChange={(v) => onChange({ initialCapital: v })}
                    />
                    <Field
                        id="monthlyContribution"
                        label={t('form.monthlyContribution')}
                        unit={t('form.currencyUnit')}
                        step={50}
                        value={inputs.monthlyContribution}
                        onChange={(v) => onChange({ monthlyContribution: v })}
                    />
                    <Field
                        id="annualRate"
                        label={t('form.annualRate')}
                        unit={t('form.percentUnit')}
                        step={0.1}
                        value={inputs.annualRate}
                        onChange={(v) => onChange({ annualRate: v })}
                    />
                    <Field
                        id="years"
                        label={t('form.years')}
                        unit={t('form.yearsUnit', { count: inputs.years })}
                        step={1}
                        min={1}
                        value={inputs.years}
                        onChange={(v) => onChange({ years: v })}
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
                            value={inputs.wrapperFee}
                            tooltip={t('form.wrapperFeeInfo')}
                            onChange={(v) => onChange({ wrapperFee: v })}
                        />
                        <Field
                            id="fundFee"
                            label={t('form.fundFee')}
                            unit={t('form.percentUnit')}
                            step={0.1}
                            value={inputs.fundFee}
                            tooltip={t('form.fundFeeInfo')}
                            onChange={(v) => onChange({ fundFee: v })}
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
                        value={inputs.inflationRate}
                        onChange={(v) => onChange({ inflationRate: v })}
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
                        value={inputs.taxRate}
                        onChange={(v) => onChange({ taxRate: v })}
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
                                    onClick={() => onChange({ taxRate: s.rate })}
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
