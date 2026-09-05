import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import AmountField from '@/components/form/AmountField';
import SliderField from '@/components/form/SliderField';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ENVELOPE_FIELD_CONFIG, ENVELOPE_FIELD_ORDER, type EnvelopeFieldKey } from '@/features/multi-envelope-simulator/lib/envelopeFields';
import type { AccountType, EnvelopeFormValues } from '@/features/multi-envelope-simulator/types';

interface EnvelopeRowProps {
    index: number;
    accountTypes: AccountType[];
    values: EnvelopeFormValues;
    /** Flat error map keyed like Laravel's validation errors (e.g. "envelopes.0.initialAmount"). */
    errors: Record<string, string | undefined>;
    canRemove: boolean;
    onChange: <K extends keyof EnvelopeFormValues>(field: K, value: EnvelopeFormValues[K]) => void;
    onRemove: () => void;
}

export default function EnvelopeRow({ index, accountTypes, values, errors, canRemove, onChange, onRemove }: EnvelopeRowProps) {
    const { t } = useTranslation();

    const renderField = (fieldKey: EnvelopeFieldKey) => {
        const config = ENVELOPE_FIELD_CONFIG[fieldKey];
        const label = t(`simulator.multiEnvelope.form.fields.${fieldKey}.label`);
        const helpText = t(`simulator.multiEnvelope.form.fields.${fieldKey}.helpText`);
        const error = errors[`envelopes.${index}.${fieldKey}`];
        const fieldId = `envelope-${index}-${fieldKey}`;

        if (config.control === 'amount') {
            return (
                <AmountField
                    key={fieldKey}
                    fieldKey={fieldId}
                    label={label}
                    helpText={helpText}
                    value={values[fieldKey]}
                    step={config.step}
                    error={error}
                    onChange={(value) => onChange(fieldKey, value)}
                />
            );
        }

        return (
            <SliderField
                key={fieldKey}
                fieldKey={fieldId}
                label={label}
                helpText={helpText}
                value={values[fieldKey]}
                unit={config.unit}
                step={config.step}
                min={config.min}
                max={config.max}
                error={error}
                onChange={(value) => onChange(fieldKey, value)}
            />
        );
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor={`envelope-${index}-accountType`}>
                        {t('simulator.multiEnvelope.form.envelopeLabel', { index: index + 1 })}
                    </Label>
                    <Select value={values.accountType} onValueChange={(value) => onChange('accountType', value as AccountType)}>
                        <SelectTrigger id={`envelope-${index}-accountType`} className="w-56">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {accountTypes.map((accountType) => (
                                <SelectItem key={accountType} value={accountType}>
                                    {t(`simulator.multiEnvelope.accountTypes.${accountType}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {canRemove && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        aria-label={t('simulator.multiEnvelope.form.removeEnvelope', { index: index + 1 })}
                        onClick={onRemove}
                    >
                        <Trash2 aria-hidden className="size-4" />
                    </Button>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">{ENVELOPE_FIELD_ORDER.map(renderField)}</div>
        </div>
    );
}
