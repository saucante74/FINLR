import { Link, router } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CALCULATOR_TYPES } from '@/features/dashboard/constants';
import { formatDate } from '@/features/dashboard/lib/format';
import type { CalculatorType, ScenarioSummary } from '@/features/dashboard/types';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

const GRID_COLUMNS = 'sm:grid-cols-[1.6fr_1fr_0.8fr_1fr_1.25rem]';
const ALL_TYPES_VALUE = 'all';

interface ScenarioListProps {
    scenarios: Paginated<ScenarioSummary>;
    // The `type` filter currently applied server-side — null means
    // unfiltered (the default "Type de scénarios" option). Comes from the
    // same Inertia round-trip as `scenarios` so the dropdown never shows a
    // filter that doesn't match what's actually displayed.
    activeType: CalculatorType | null;
}

export default function ScenarioList({ scenarios, activeType }: ScenarioListProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    const formatHorizon = (years: number): string =>
        years > 0 ? `${years} ${t('form.yearsUnit', { count: years })}` : '—';

    // Scenarios are already loaded one server-paginated page at a time
    // (see goToPage below), so filtering client-side would only ever
    // filter the 10 rows currently in memory — wrong totals/page count for
    // every other page. Filtering goes through the same Inertia round-trip
    // as pagination instead, and both requests refresh `scenarioTypeFilter`
    // together with `scenarios` so the dropdown and the rows never drift
    // out of sync with each other.
    const goToPage = (page: number) => {
        router.get(
            route('dashboard'),
            { page, ...(activeType ? { type: activeType } : {}) },
            { preserveState: true, preserveScroll: true, only: ['scenarios', 'scenarioTypeFilter'] },
        );
    };

    const handleTypeFilterChange = (value: string) => {
        router.get(
            route('dashboard'),
            value === ALL_TYPES_VALUE ? {} : { type: value },
            { preserveState: true, preserveScroll: true, only: ['scenarios', 'scenarioTypeFilter'] },
        );
    };

    return (
        <Card className="gap-0 overflow-hidden rounded-2xl py-0">
            <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-5">
                <div className="flex items-baseline gap-3">
                    <CardTitle className="text-base">{t('dashboard.scenarioList.title')}</CardTitle>
                    {scenarios.total > 0 && (
                        <span className="font-mono text-xs text-muted-foreground">
                            {t('dashboard.scenarioList.count', { count: scenarios.total })}
                        </span>
                    )}
                </div>
                <Select value={activeType ?? ALL_TYPES_VALUE} onValueChange={handleTypeFilterChange}>
                    <SelectTrigger aria-label={t('dashboard.scenarioList.filter.ariaLabel')} className="w-auto">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                        <SelectItem value={ALL_TYPES_VALUE}>{t('dashboard.scenarioList.filter.placeholder')}</SelectItem>
                        {CALCULATOR_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                                {t(`dashboard.scenarioList.calculatorTypes.${type}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="p-0">
                {scenarios.data.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground">{t('dashboard.scenarioList.empty')}</p>
                ) : (
                    <>
                        <div
                            className={cn(
                                'hidden gap-4 border-b-2 border-brand/20 px-6 py-3 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase sm:grid',
                                GRID_COLUMNS,
                            )}
                        >
                            <span>{t('dashboard.scenarioList.columns.name')}</span>
                            <span className="text-center">{t('dashboard.scenarioList.columns.type')}</span>
                            <span className="text-center">{t('dashboard.scenarioList.columns.horizon')}</span>
                            <span className="text-center">{t('dashboard.scenarioList.columns.date')}</span>
                            {/* No label: icon-only "open" column, described per-row via the link's aria-label. */}
                            <span aria-hidden />
                        </div>
                        <ul className="flex flex-col divide-y divide-border">
                            {scenarios.data.map((scenario) => {
                                const displayName = scenario.name ?? t('dashboard.scenarioList.genericLabel');
                                const typeLabel = t(scenario.typeLabel);
                                const horizonLabel = formatHorizon(scenario.years);
                                const dateLabel = formatDate(scenario.createdAt, locale);

                                return (
                                    <li key={scenario.id}>
                                        <Link
                                            href={route('scenarios.show', scenario.id)}
                                            aria-label={t('dashboard.scenarioList.openAriaLabel', { name: displayName })}
                                            className={cn(
                                                'group flex flex-col gap-1 px-6 py-4 text-sm transition-colors hover:bg-brand/5 sm:grid sm:items-center sm:gap-4',
                                                GRID_COLUMNS,
                                            )}
                                        >
                                            <span className="font-medium group-hover:text-brand sm:order-1">
                                                {displayName}
                                            </span>
                                            <span className="text-xs text-muted-foreground sm:hidden">
                                                {typeLabel} · {horizonLabel} · {dateLabel}
                                            </span>
                                            <span className="hidden text-center text-muted-foreground sm:order-2 sm:block">
                                                {typeLabel}
                                            </span>
                                            <span className="hidden text-center text-muted-foreground sm:order-3 sm:block">
                                                {horizonLabel}
                                            </span>
                                            <span className="hidden text-center text-muted-foreground sm:order-4 sm:block">
                                                {dateLabel}
                                            </span>
                                            <ArrowRight
                                                aria-hidden
                                                className="hidden size-4 shrink-0 text-muted-foreground transition-colors sm:order-5 sm:block sm:justify-self-end group-hover:text-brand"
                                            />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="border-t border-border px-6 py-4">
                            <Pagination
                                currentPage={scenarios.currentPage}
                                lastPage={scenarios.lastPage}
                                onPageChange={goToPage}
                                previousLabel={t('dashboard.scenarioList.pagination.previous')}
                                nextLabel={t('dashboard.scenarioList.pagination.next')}
                                pageIndicatorLabel={t('dashboard.scenarioList.pagination.pageIndicator', {
                                    currentPage: scenarios.currentPage,
                                    lastPage: scenarios.lastPage,
                                })}
                            />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
