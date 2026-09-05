import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ACCOUNT_TYPE_CHART_COLORS } from '@/features/scenarios/constants';
import type { AccountType, MultiEnvelopePocketResult, MultiEnvelopeScenarioResult } from '@/features/multi-envelope-simulator/types';
import ScenarioChart from '@/features/scenarios/components/ScenarioChart';
import type { ScenarioResultPoint } from '@/features/scenarios/types';
import { formatCompact, formatCurrency } from '@/lib/currency';

const BAR_CHART_HEIGHT = 220;
const BAR_CHART_MARGIN = { top: 24, right: 12, bottom: 12, left: 12 };
const BAR_GAP = 16;

interface EnvelopeBalanceBarChartProps {
    pockets: MultiEnvelopePocketResult[];
}

/**
 * Bar chart comparing the final net balance of each pocket, colored by
 * AccountType (ACCOUNT_TYPE_CHART_COLORS). Not a per-envelope trajectory:
 * docs/API.md §2 confirms PocketResultData only carries the final state of
 * each pocket, not a year-by-year history — yearlyBreakdown (plotted above,
 * via ScenarioChart) is consolidated across every pocket, never split back
 * out per envelope. This bar chart is this result's only *by-envelope*
 * comparison the package's own data can support (see also the module
 * docblock below).
 *
 * Structured like FireScenarioSummary's FireScenarioBarChart: category
 * identity (which color is which account type) lives in the shared HTML
 * legend, not as axis text — with up to 8 pockets and account type labels
 * as long as "Assurance-vie" or "Compte à terme", per-bar text would
 * overlap or clip on a narrow bar, the same fitting problem already solved
 * there.
 */
function EnvelopeBalanceBarChart({ pockets }: EnvelopeBalanceBarChartProps) {
    const { i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(600);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return undefined;

        const observer = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width;
            if (w > 0) setWidth(w);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const innerWidth = Math.max(width - BAR_CHART_MARGIN.left - BAR_CHART_MARGIN.right, 10);
    const innerHeight = BAR_CHART_HEIGHT - BAR_CHART_MARGIN.top - BAR_CHART_MARGIN.bottom;
    const baselineY = BAR_CHART_MARGIN.top + innerHeight;

    const barWidth = Math.max((innerWidth - BAR_GAP * (pockets.length - 1)) / pockets.length, 8);
    const maxValue = Math.max(1, ...pockets.map((pocket) => pocket.netBalance));

    return (
        <div ref={containerRef} className="w-full">
            <svg width={width} height={BAR_CHART_HEIGHT}>
                <line
                    x1={BAR_CHART_MARGIN.left}
                    x2={width - BAR_CHART_MARGIN.right}
                    y1={baselineY}
                    y2={baselineY}
                    stroke="var(--border)"
                />
                {pockets.map((pocket, index) => {
                    const x = BAR_CHART_MARGIN.left + index * (barWidth + BAR_GAP);
                    const centerX = x + barWidth / 2;
                    const barHeight = Math.max((pocket.netBalance / maxValue) * innerHeight, 2);
                    const y = baselineY - barHeight;

                    return (
                        <g key={index}>
                            <text x={centerX} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
                                {formatCompact(pocket.netBalance, locale)}
                            </text>
                            <rect x={x} y={y} width={barWidth} height={barHeight} rx={4} fill={ACCOUNT_TYPE_CHART_COLORS[pocket.accountType]} />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

interface MultiEnvelopeScenarioSummaryProps {
    result: MultiEnvelopeScenarioResult;
}

/**
 * Result view for a saved multi-envelope scenario. Every field rendered
 * below is checked against PocketResultData / YearlyResultData
 * (docs/API.md §2) — nothing invented.
 *
 * Chart data availability (task brief point 6): MultiEnvelopeSimulator's
 * output is "identique à CalculationResult" (§2) — a single, consolidated
 * `yearlyBreakdown` for the whole cascade, not one per pocket, and
 * PocketResult never carries a trajectory, only the final state. A real
 * per-envelope curve is therefore not something this data can support
 * without inventing values the engine never computed. This view instead
 * offers the two honest alternatives: the consolidated portfolio curve
 * (reusing ScenarioChart, the same component the single-envelope result
 * already uses — its 4 series are a 1:1 field rename of
 * MultiEnvelopeYearlyResult, verified against
 * app/Modules/SimulationEngine/Services/FinlrEngineAdapter.php's own
 * mapping for the single-envelope case) and a bar chart comparing each
 * pocket's final net balance, colored by account type.
 */
export default function MultiEnvelopeScenarioSummary({ result }: MultiEnvelopeScenarioSummaryProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    const chartPoints: ScenarioResultPoint[] = result.yearlyBreakdown.map((year) => ({
        year: year.year,
        contributions: year.totalDeposited,
        gross: year.grossBalance,
        netReal: year.netBalance,
        netRealAdjusted: year.realNetBalanceWithInflation,
    }));

    const accountTypeLabel = (accountType: AccountType) => t(`simulator.multiEnvelope.accountTypes.${accountType}`);

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('scenario.multiEnvelope.summaryTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                            {t('scenario.multiEnvelope.netBalance')}
                        </span>
                        <span className="font-mono text-lg font-semibold tabular-nums text-brand">
                            {formatCurrency(result.summary.netBalance, locale)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                            {t('scenario.multiEnvelope.realNetBalance')}
                        </span>
                        <span className="font-mono text-lg font-semibold tabular-nums">
                            {formatCurrency(result.summary.realNetBalanceWithInflation, locale)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                            {t('scenario.multiEnvelope.totalDeposited')}
                        </span>
                        <span className="font-mono text-lg font-semibold tabular-nums">
                            {formatCurrency(result.summary.totalDeposited, locale)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {chartPoints.length > 0 && <ScenarioChart result={{ points: chartPoints }} />}

            <Card>
                <CardHeader className="flex flex-col gap-4">
                    <CardTitle className="text-base">{t('scenario.multiEnvelope.finalBalanceChartTitle')}</CardTitle>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {result.pockets.map((pocket, index) => (
                            <span key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span
                                    aria-hidden
                                    className="h-2.5 w-4 shrink-0 rounded-full"
                                    style={{ backgroundColor: ACCOUNT_TYPE_CHART_COLORS[pocket.accountType] }}
                                />
                                {accountTypeLabel(pocket.accountType)}
                            </span>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <EnvelopeBalanceBarChart pockets={result.pockets} />
                </CardContent>
            </Card>

            <Card className="gap-0 overflow-hidden py-0">
                <CardHeader className="border-b border-border py-5">
                    <CardTitle className="text-base">{t('scenario.multiEnvelope.pocketsTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ul className="flex flex-col divide-y divide-border">
                        {result.pockets.map((pocket, index) => (
                            <li key={index} className="flex flex-col gap-5 px-6 py-5 text-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-medium">{accountTypeLabel(pocket.accountType)}</span>
                                    <span className="font-mono font-semibold tabular-nums text-brand">
                                        {formatCurrency(pocket.netBalance, locale)}
                                    </span>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex flex-col gap-2.5">
                                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                            {t('scenario.multiEnvelope.pocket.deposits.title')}
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.deposits.initialDeposit')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.initialDeposit, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.deposits.dcaDeposited')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.dcaDeposited, locale)}{' '}
                                                    <span className="text-xs text-muted-foreground">
                                                        {t('scenario.multiEnvelope.pocket.deposits.dcaMonths', {
                                                            count: pocket.dcaMonthsCount,
                                                        })}
                                                    </span>
                                                </span>
                                            </div>
                                            {pocket.firstResidualDcaAmount > 0 && (
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        {t('scenario.multiEnvelope.pocket.deposits.residualDca')}
                                                    </span>
                                                    <span className="font-mono tabular-nums">
                                                        {formatCurrency(pocket.firstResidualDcaAmount, locale)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-muted-foreground">
                                                        {t('scenario.multiEnvelope.pocket.deposits.lastDcaAmount')}
                                                    </span>
                                                    <span className="font-mono tabular-nums">
                                                        {formatCurrency(pocket.lastDcaAmount, locale)}
                                                    </span>
                                                </div>
                                                {pocket.ceilingReachedMonth !== null && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {pocket.ceilingReachedMonth === 0
                                                            ? t('scenario.multiEnvelope.pocket.deposits.ceilingReachedAtStart')
                                                            : t('scenario.multiEnvelope.pocket.deposits.ceilingReachedAtMonth', {
                                                                  month: pocket.ceilingReachedMonth,
                                                              })}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between gap-4 border-t border-border pt-1.5">
                                                <span className="font-medium">
                                                    {t('scenario.multiEnvelope.pocket.deposits.totalDeposited')}
                                                </span>
                                                <span className="font-mono font-medium tabular-nums">
                                                    {formatCurrency(pocket.totalDeposited, locale)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                            {t('scenario.multiEnvelope.pocket.fees.title')}
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.fees.brokerage')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.brokerageFeesAmount, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.fees.management')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.managementFeesAmount, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.fees.ter')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.terImpactAmount, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.fees.custody')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.custodyFeesAmount, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.fees.arbitrage')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.arbitrageFeesAmount, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 border-t border-border pt-1.5">
                                                <span className="font-medium">
                                                    {t('scenario.multiEnvelope.pocket.fees.total')}
                                                </span>
                                                <span className="font-mono font-medium tabular-nums">
                                                    {formatCurrency(pocket.totalFeesAmount, locale)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                            {t('scenario.multiEnvelope.pocket.taxation.title')}
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.taxation.regime')}
                                                </span>
                                                <span className="font-medium">
                                                    {t(`scenario.multiEnvelope.taxRegimes.${pocket.taxRegime}`)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.taxation.incomeTax')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.incomeTaxAmount, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.taxation.socialLevies')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.socialLeviesAmount, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 border-t border-border pt-1.5">
                                                <span className="font-medium">
                                                    {t('scenario.multiEnvelope.pocket.taxation.total')}
                                                </span>
                                                <span className="font-mono font-medium tabular-nums">
                                                    {formatCurrency(pocket.taxesAmount, locale)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                            {t('scenario.multiEnvelope.pocket.result.title')}
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.result.grossBalance')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.grossBalance, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {t('scenario.multiEnvelope.pocket.result.totalGains')}
                                                </span>
                                                <span className="font-mono tabular-nums">
                                                    {formatCurrency(pocket.totalGains, locale)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 border-t border-border pt-1.5">
                                                <span className="font-medium">
                                                    {t('scenario.multiEnvelope.pocket.result.netBalance')}
                                                </span>
                                                <span className="font-mono font-semibold tabular-nums text-brand">
                                                    {formatCurrency(pocket.netBalance, locale)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
