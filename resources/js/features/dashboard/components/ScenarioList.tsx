import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/features/dashboard/lib/format';
import type { ScenarioSummary } from '@/features/dashboard/types';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

const KNOWN_WRAPPERS = ['pea', 'cto', 'av'] as const;

const GRID_COLUMNS = 'sm:grid-cols-[1.6fr_0.8fr_0.8fr_1fr_auto_1.25rem]';

interface ScenarioListProps {
    scenarios: ScenarioSummary[];
}

export default function ScenarioList({ scenarios }: ScenarioListProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    const formatWrapper = (wrapper: string): string =>
        (KNOWN_WRAPPERS as readonly string[]).includes(wrapper) ? t(`form.wrappers.${wrapper}`) : '—';

    const formatHorizon = (years: number): string =>
        years > 0 ? `${years} ${t('form.yearsUnit', { count: years })}` : '—';

    return (
        <Card className="gap-0 overflow-hidden rounded-2xl py-0">
            <CardHeader className="flex items-baseline gap-3 border-b border-border py-5">
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
                        <div
                            className={cn(
                                'hidden gap-4 border-b border-border px-6 py-3 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase sm:grid',
                                GRID_COLUMNS,
                            )}
                        >
                            <span>{t('dashboard.scenarioList.columns.name')}</span>
                            <span className="text-center">{t('dashboard.scenarioList.columns.wrapper')}</span>
                            <span className="text-center">{t('dashboard.scenarioList.columns.horizon')}</span>
                            <span className="text-center">{t('dashboard.scenarioList.columns.date')}</span>
                            <span className="text-right">{t('dashboard.scenarioList.columns.amount')}</span>
                            {/* No label: icon-only "open" column, described per-row via the link's aria-label. */}
                            <span aria-hidden />
                        </div>
                        <ul className="flex flex-col divide-y divide-border">
                            {scenarios.map((scenario) => {
                                const displayName = scenario.name ?? t('dashboard.scenarioList.genericLabel');
                                const wrapperLabel = formatWrapper(scenario.wrapper);
                                const horizonLabel = formatHorizon(scenario.years);
                                const dateLabel = formatDate(scenario.createdAt, locale);

                                return (
                                    <li key={scenario.id}>
                                        <Link
                                            href={route('scenarios.show', scenario.id)}
                                            aria-label={t('dashboard.scenarioList.openAriaLabel', { name: displayName })}
                                            className={cn(
                                                'group flex flex-col gap-1 px-6 py-4 text-sm transition-colors hover:bg-muted/50 sm:grid sm:items-center sm:gap-4',
                                                GRID_COLUMNS,
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-4 sm:contents">
                                                <span className="font-medium group-hover:text-brand sm:order-1">
                                                    {displayName}
                                                </span>
                                                <span className="font-mono font-medium text-brand tabular-nums sm:order-5 sm:text-right [text-shadow:0_0_24px_var(--brand)]">
                                                    {formatCurrency(scenario.headlineFigure, locale)}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground sm:hidden">
                                                {wrapperLabel} · {horizonLabel} · {dateLabel}
                                            </span>
                                            <span className="hidden ms-5 text-center text-muted-foreground sm:order-2 sm:block">
                                                {wrapperLabel}
                                            </span>
                                            <span className="hidden ms-7 text-center text-muted-foreground sm:order-3 sm:block">
                                                {horizonLabel}
                                            </span>
                                            <span className="hidden ms-9 text-center text-muted-foreground sm:order-4 sm:block">
                                                {dateLabel}
                                            </span>
                                            <ArrowRight
                                                aria-hidden
                                                className="hidden size-4 shrink-0 text-muted-foreground transition-colors sm:order-6 sm:block sm:justify-self-end group-hover:text-brand"
                                            />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
