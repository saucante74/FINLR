import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScenarioResult } from '@/features/scenarios/types';
import { formatCurrency } from '@/lib/currency';

interface ScenarioSummaryProps {
    result: ScenarioResult;
}

export default function ScenarioSummary({ result }: ScenarioSummaryProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    const kpis: { key: string; labelKey: string; value: number }[] = [
        { key: 'invested', labelKey: 'scenario.summary.invested', value: result.invested },
        { key: 'finalGross', labelKey: 'scenario.summary.finalGross', value: result.finalGross },
        { key: 'finalNetReal', labelKey: 'scenario.summary.finalNetReal', value: result.finalNetReal },
        {
            key: 'finalNetRealAdjusted',
            labelKey: 'scenario.summary.finalNetRealAdjusted',
            value: result.finalNetRealAdjusted,
        },
        { key: 'shortfall', labelKey: 'scenario.summary.shortfall', value: result.shortfall },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('scenario.summary.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {kpis.map((kpi) => (
                        <div key={kpi.key} className="flex flex-col gap-1">
                            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                {t(kpi.labelKey)}
                            </dt>
                            <dd className="text-xl font-semibold tracking-tight tabular-nums">
                                {formatCurrency(kpi.value, locale)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );
}
