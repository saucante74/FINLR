import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface SliderFieldProps {
    fieldKey: string;
    label: string;
    helpText: string;
    value: number;
    unit: 'percent' | 'years';
    step: number;
    min: number;
    max: number;
    error?: string;
    onChange: (value: number) => void;
}

/** A numeric input paired with a slider, for a bounded rate/duration field. */
export default function SliderField({
    fieldKey,
    label,
    helpText,
    value,
    unit,
    step,
    min,
    max,
    error,
    onChange,
}: SliderFieldProps) {
    const { t } = useTranslation();
    const unitLabel = unit === 'percent' ? t('form.percentUnit') : t('form.yearsUnit', { count: value });

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <Label htmlFor={fieldKey}>{label}</Label>
                <div className="flex items-center gap-1.5">
                    <Input
                        id={fieldKey}
                        name={fieldKey}
                        type="number"
                        inputMode="decimal"
                        step={step}
                        min={min}
                        max={max}
                        value={value}
                        aria-invalid={Boolean(error)}
                        className="w-20 text-right tabular-nums"
                        onChange={(e) => onChange(Number(e.target.value))}
                    />
                    <span className="text-sm text-muted-foreground">{unitLabel}</span>
                </div>
            </div>
            <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={([next]) => onChange(next)}
            />
            <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
                {error ?? helpText}
            </p>
        </div>
    );
}
