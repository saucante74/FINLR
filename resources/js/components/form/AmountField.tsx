import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface AmountFieldProps {
    fieldKey: string;
    label: string;
    helpText: string;
    value: number;
    step: number;
    error?: string;
    onChange: (value: number) => void;
}

/** A currency-prefixed numeric input with a label and help/error text. */
export default function AmountField({ fieldKey, label, helpText, value, step, error, onChange }: AmountFieldProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={fieldKey}>{label}</Label>
            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                    {t('form.currencyUnit')}
                </span>
                <Input
                    id={fieldKey}
                    name={fieldKey}
                    type="number"
                    inputMode="decimal"
                    step={step}
                    min={0}
                    value={value}
                    aria-invalid={Boolean(error)}
                    className="pl-7 tabular-nums"
                    onChange={(e) => onChange(Number(e.target.value))}
                />
            </div>
            <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
                {error ?? helpText}
            </p>
        </div>
    );
}
