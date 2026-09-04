import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalogyDelta, AnalogyScenarioResult, CeilingEvent } from '@/features/analogy-simulator/types';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface AnalogyScenarioSummaryProps {
    result: AnalogyScenarioResult;
}

/**
 * Result view for a saved Analogy comparison scenario: the deltas explicitly
 * listed in this task's brief (real net balance, fees, taxes, gains, amount
 * invested — docs/API.md §3), the final leader, the crossover years (if
 * any), and — for each year of yearlyBreakdown — the ceiling events (if
 * any), same "no field invented beyond what the package documents"
 * discipline as MultiEnvelopeScenarioSummary (Étape 2).
 */
export default function AnalogyScenarioSummary({ result }: AnalogyScenarioSummaryProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    const leaderLabel =
        result.finalLeader === 'TIE'
            ? t('scenario.analogy.tie')
            : t('scenario.analogy.leader', {
                  label: result.finalLeader === 'SCENARIO_A' ? result.labelA : result.labelB,
              });

    const metrics: Array<{ key: string; label: string; delta: AnalogyDelta }> = [
        {
            key: 'realNetBalanceWithInflation',
            label: t('scenario.analogy.metrics.realNetBalanceWithInflation'),
            delta: result.realNetBalanceWithInflation,
        },
        { key: 'totalDeposited', label: t('scenario.analogy.metrics.totalDeposited'), delta: result.totalDeposited },
        { key: 'totalGains', label: t('scenario.analogy.metrics.totalGains'), delta: result.totalGains },
        { key: 'taxesAmount', label: t('scenario.analogy.metrics.taxesAmount'), delta: result.taxesAmount },
        { key: 'totalFees', label: t('scenario.analogy.metrics.totalFees'), delta: result.totalFees },
    ];

    const yearsWithCeilingEvents = result.yearlyBreakdown.filter((point) => point.hasCeilingEvent);

    const formatCeilingEvent = (event: CeilingEvent, scenarioLabel: string): string =>
        t('scenario.analogy.ceilingEvent', {
            scenario: scenarioLabel,
            accountType: t(`simulator.analogy.accountTypes.${event.accountType}`),
            ceiling: event.ceiling === null ? '—' : formatCurrency(event.ceiling, locale),
        });

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        {result.labelA} <span className="text-muted-foreground">{t('scenario.analogy.vs')}</span>{' '}
                        {result.labelB}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <p className="text-sm">
                        <span className="font-semibold text-brand">{leaderLabel}</span>
                    </p>
                    {result.hasCrossover && (
                        <p className="text-sm text-muted-foreground">
                            {t('scenario.analogy.crossoverYears', { years: result.crossoverYears.join(', ') })}
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card className="gap-0 overflow-hidden py-0">
                <CardHeader className="border-b border-border py-5">
                    <CardTitle className="text-base">{t('scenario.analogy.deltasTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div
                        className="hidden gap-4 border-b border-border px-6 py-3 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase sm:grid sm:grid-cols-[1.4fr_1fr_1fr_1fr_0.6fr]"
                    >
                        <span>{t('scenario.analogy.metric')}</span>
                        <span className="text-right">{result.labelA}</span>
                        <span className="text-right">{result.labelB}</span>
                        <span className="text-right">{t('scenario.analogy.delta')}</span>
                        <span className="text-right">%</span>
                    </div>
                    <ul className="flex flex-col divide-y divide-border">
                        {metrics.map(({ key, label, delta }) => (
                            <li
                                key={key}
                                className="grid grid-cols-2 gap-2 px-6 py-3 text-sm sm:grid-cols-[1.4fr_1fr_1fr_1fr_0.6fr] sm:items-center sm:gap-4"
                            >
                                <span className="col-span-2 font-medium sm:col-span-1">{label}</span>
                                <span className="text-right font-mono tabular-nums text-muted-foreground">
                                    {formatCurrency(delta.valueA, locale)}
                                </span>
                                <span className="text-right font-mono tabular-nums text-muted-foreground">
                                    {formatCurrency(delta.valueB, locale)}
                                </span>
                                <span
                                    className={cn(
                                        'text-right font-mono font-semibold tabular-nums',
                                        delta.absolute > 0 && 'text-brand',
                                    )}
                                >
                                    {formatCurrency(delta.absolute, locale)}
                                </span>
                                <span className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                                    {delta.percent === null ? '—' : `${(delta.percent * 100).toFixed(1)} %`}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {yearsWithCeilingEvents.length > 0 && (
                <Card className="gap-0 overflow-hidden py-0">
                    <CardHeader className="border-b border-border py-5">
                        <CardTitle className="text-base">{t('scenario.analogy.ceilingEventsTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ul className="flex flex-col divide-y divide-border">
                            {yearsWithCeilingEvents.map((point) => (
                                <li key={point.year} className="flex flex-col gap-1.5 px-6 py-3 text-sm">
                                    <span className="font-medium">
                                        {t('scenario.analogy.yearLabel', { year: point.year })}
                                    </span>
                                    {point.ceilingEventsA.map((event, index) => (
                                        <span key={`a-${index}`} className="text-muted-foreground">
                                            {formatCeilingEvent(event, result.labelA)}
                                        </span>
                                    ))}
                                    {point.ceilingEventsB.map((event, index) => (
                                        <span key={`b-${index}`} className="text-muted-foreground">
                                            {formatCeilingEvent(event, result.labelB)}
                                        </span>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
