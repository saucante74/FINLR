import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScenarioInput } from '@/features/scenarios/types';

interface ScenarioDetailsProps {
    input: ScenarioInput;
}

export default function ScenarioDetails({ input }: ScenarioDetailsProps) {
    const { t } = useTranslation();

    const fields: { key: string; labelKey: string; value: string }[] = [
        { key: 'initialCapital', labelKey: 'scenario.details.initialCapital', value: String(input.initialCapital) },
        {
            key: 'monthlyContribution',
            labelKey: 'scenario.details.monthlyContribution',
            value: String(input.monthlyContribution),
        },
        { key: 'annualRate', labelKey: 'scenario.details.annualRate', value: `${input.annualRate}%` },
        { key: 'years', labelKey: 'scenario.details.years', value: String(input.years) },
        { key: 'wrapperFee', labelKey: 'scenario.details.wrapperFee', value: `${input.wrapperFee}%` },
        { key: 'fundFee', labelKey: 'scenario.details.fundFee', value: `${input.fundFee}%` },
        { key: 'taxRate', labelKey: 'scenario.details.taxRate', value: `${input.taxRate}%` },
        { key: 'inflationRate', labelKey: 'scenario.details.inflationRate', value: `${input.inflationRate}%` },
        {
            key: 'inflationEnabled',
            labelKey: 'scenario.details.inflationEnabled',
            value: input.inflationEnabled ? t('scenario.details.inflationYes') : t('scenario.details.inflationNo'),
        },
        {
            key: 'wrapper',
            labelKey: 'scenario.details.wrapper',
            value: t(`scenario.details.wrapperOptions.${input.wrapper}`),
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('scenario.details.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {fields.map((field) => (
                        <div key={field.key} className="flex flex-col gap-1">
                            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                {t(field.labelKey)}
                            </dt>
                            <dd className="text-sm font-medium tabular-nums">{field.value}</dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );
}
