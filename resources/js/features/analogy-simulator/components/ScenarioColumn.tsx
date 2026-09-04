import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AccountType } from '@/features/analogy-simulator/types';

interface ScenarioColumnProps {
    side: 'A' | 'B';
    accountTypes: AccountType[];
    accountType: AccountType;
    label: string;
    accountTypeError?: string;
    labelError?: string;
    onAccountTypeChange: (accountType: AccountType) => void;
    onLabelChange: (label: string) => void;
}

export default function ScenarioColumn({
    side,
    accountTypes,
    accountType,
    label,
    accountTypeError,
    labelError,
    onAccountTypeChange,
    onLabelChange,
}: ScenarioColumnProps) {
    const { t } = useTranslation();
    const accountTypeFieldId = `scenario-${side}-account-type`;
    const labelFieldId = `scenario-${side}-label`;

    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
            <span className="font-mono text-xs tracking-wide text-brand uppercase">
                {t(`simulator.analogy.form.scenario${side}`)}
            </span>

            <div className="flex flex-col gap-2">
                <Label htmlFor={accountTypeFieldId}>{t('simulator.analogy.form.accountType')}</Label>
                <Select value={accountType} onValueChange={(value) => onAccountTypeChange(value as AccountType)}>
                    <SelectTrigger id={accountTypeFieldId} className="w-full" aria-invalid={Boolean(accountTypeError)}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {accountTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {t(`simulator.analogy.accountTypes.${type}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {accountTypeError && <p className="text-xs text-destructive">{accountTypeError}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor={labelFieldId}>{t('simulator.analogy.form.label')}</Label>
                <Input
                    id={labelFieldId}
                    name={labelFieldId}
                    type="text"
                    maxLength={255}
                    placeholder={t(`simulator.analogy.defaultLabel${side}`)}
                    value={label}
                    aria-invalid={Boolean(labelError)}
                    onChange={(e) => onLabelChange(e.target.value)}
                />
                <p className={labelError ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'}>
                    {labelError ?? t('simulator.analogy.form.labelHelpText')}
                </p>
            </div>
        </div>
    );
}
