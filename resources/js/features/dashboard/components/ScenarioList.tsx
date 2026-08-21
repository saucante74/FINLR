import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/features/dashboard/lib/format';
import type { ScenarioSummary } from '@/features/dashboard/types';
import { formatCurrency } from '@/lib/currency';

interface ScenarioListProps {
    scenarios: ScenarioSummary[];
}

export default function ScenarioList({ scenarios }: ScenarioListProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.scenarioList.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                {scenarios.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('dashboard.scenarioList.empty')}</p>
                ) : (
                    <ul className="flex flex-col divide-y divide-border">
                        {scenarios.map((scenario) => (
                            <li key={scenario.id}>
                                <Link
                                    href={route('scenarios.show', scenario.id)}
                                    className="flex items-center justify-between gap-4 py-3 text-sm hover:text-brand"
                                >
                                    <span className="flex flex-col">
                                        <span className="font-medium">
                                            {t(`dashboard.scenarioList.calculatorTypes.${scenario.calculatorType}`)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(scenario.createdAt, locale)}
                                        </span>
                                    </span>
                                    <span className="font-medium tabular-nums">
                                        {formatCurrency(scenario.headlineFigure, locale)}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
