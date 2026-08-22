import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
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
        <Card className="gap-0 overflow-hidden rounded-2xl py-0">
            <CardHeader className="flex-row items-baseline gap-3 border-b border-border py-5">
                <CardTitle className="text-base">{t('dashboard.scenarioList.title')}</CardTitle>
                {scenarios.length > 0 && (
                    <span className="font-mono text-xs text-muted-foreground">
                        {t('dashboard.scenarioList.count', { count: scenarios.length })}
                    </span>
                )}
            </CardHeader>
            <CardContent className="p-0">
                {scenarios.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">{t('dashboard.scenarioList.empty')}</p>
                ) : (
                    <>
                        <div className="hidden grid-cols-[1.6fr_1fr_auto] gap-4 border-b border-border px-6 py-3 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase sm:grid">
                            <span>{t('dashboard.scenarioList.columns.name')}</span>
                            <span>{t('dashboard.scenarioList.columns.date')}</span>
                            <span className="text-right">{t('dashboard.scenarioList.columns.amount')}</span>
                        </div>
                        <ul className="flex flex-col divide-y divide-border">
                            {scenarios.map((scenario) => (
                                <li key={scenario.id}>
                                    <Link
                                        href={route('scenarios.show', scenario.id)}
                                        className="group grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-4 text-sm transition-colors hover:bg-muted/50 sm:grid-cols-[1.6fr_1fr_auto]"
                                    >
                                        <span className="flex flex-col gap-0.5">
                                            <span className="font-medium group-hover:text-brand">
                                                {t(`dashboard.scenarioList.calculatorTypes.${scenario.calculatorType}`)}
                                            </span>
                                            <span className="text-xs text-muted-foreground sm:hidden">
                                                {formatDate(scenario.createdAt, locale)}
                                            </span>
                                        </span>
                                        <span className="hidden text-xs text-muted-foreground sm:inline">
                                            {formatDate(scenario.createdAt, locale)}
                                        </span>
                                        <span className="flex items-center justify-end gap-2 font-mono font-medium tabular-nums">
                                            {formatCurrency(scenario.headlineFigure, locale)}
                                            <ArrowRight
                                                aria-hidden
                                                className="size-3.5 text-brand opacity-0 transition-opacity group-hover:opacity-100"
                                            />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
