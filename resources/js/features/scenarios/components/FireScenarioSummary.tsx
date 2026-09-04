import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FIRE_SCENARIO_BAR_COLORS } from '@/features/scenarios/constants';
import type { FireProjectionScenario, FireScenarioResult } from '@/features/fire-simulator/types';
import { formatCompact, formatCurrency } from '@/lib/currency';

interface FireScenarioSummaryProps {
    result: FireScenarioResult;
}

const SCENARIO_KEYS = ['optimistic', 'neutral', 'pessimistic'] as const;

type ScenarioKey = (typeof SCENARIO_KEYS)[number];

const CHART_WIDTH = 220;
const CHART_HEIGHT = 130;
const CHART_MARGIN = { top: 22, right: 8, bottom: 8, left: 8 };
const BAR_WIDTH = 44;

interface FireScenarioBarChartProps {
    title: string;
    values: Record<ScenarioKey, number | null>;
    formatValue: (value: number) => string;
    notReachedLabel: string;
}

/**
 * Small bar-chart comparing the 3 named scenarios on a single metric — no
 * yearlyBreakdown exists for FIRE (unlike every other simulator's result,
 * docs/API.md §4: FireProjectionResultData carries only the base projection
 * plus the 3 scenarios, nothing year-by-year), so this is the only
 * comparison the package's own data can support; inventing a trajectory
 * would mean guessing at a computation the engine doesn't expose (CLAUDE.md's
 * cardinal rule on the financial engine). One metric per chart (never two
 * y-scales on one axis) — instantiated twice below, once per metric, rather
 * than combining requiredCapital (€) and yearsToRetirement (years) on one
 * scale. Category identity (which bar is which scenario) lives in the shared
 * HTML legend below, not as text inside the SVG: the French labels
 * ("Pessimiste (-1 point)") are wider than a 3-bar column can hold without
 * overlapping or clipping — verified visually, not assumed — so each mark
 * carries only its value, in a fixed left-to-right order matching the
 * legend. A `null` value (target never reached) renders no bar at all — an
 * explicit "not reached" mark instead of a misleading 0-height or NaN bar.
 */
function FireScenarioBarChart({ title, values, formatValue, notReachedLabel }: FireScenarioBarChartProps) {
    const innerWidth = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const innerHeight = CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;
    const gap = (innerWidth - BAR_WIDTH * SCENARIO_KEYS.length) / (SCENARIO_KEYS.length - 1);
    const baselineY = CHART_HEIGHT - CHART_MARGIN.bottom;

    const numericValues = SCENARIO_KEYS.map((key) => values[key]).filter((value): value is number => value !== null);
    const maxValue = Math.max(1, ...numericValues);

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">{title}</span>
            <svg
                width="100%"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                role="img"
                aria-label={title}
                className="max-w-[280px]"
            >
                <line x1={CHART_MARGIN.left} x2={CHART_WIDTH - CHART_MARGIN.right} y1={baselineY} y2={baselineY} stroke="var(--border)" />
                {SCENARIO_KEYS.map((key, index) => {
                    const value = values[key];
                    const x = CHART_MARGIN.left + index * (BAR_WIDTH + gap);
                    const centerX = x + BAR_WIDTH / 2;

                    if (value === null) {
                        return (
                            <g key={key}>
                                <text
                                    x={centerX}
                                    y={baselineY - innerHeight / 2}
                                    textAnchor="middle"
                                    fontSize={18}
                                    fill="var(--muted-foreground)"
                                >
                                    –
                                </text>
                                <text
                                    x={centerX}
                                    y={baselineY - innerHeight / 2 + 16}
                                    textAnchor="middle"
                                    fontSize={9}
                                    fill="var(--muted-foreground)"
                                >
                                    {notReachedLabel}
                                </text>
                            </g>
                        );
                    }

                    const barHeight = Math.max((value / maxValue) * innerHeight, 4);
                    const y = baselineY - barHeight;

                    return (
                        <g key={key}>
                            <text x={centerX} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
                                {formatValue(value)}
                            </text>
                            <rect x={x} y={y} width={BAR_WIDTH} height={barHeight} rx={4} fill={FIRE_SCENARIO_BAR_COLORS[key]} />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

/**
 * Result view for a saved FIRE projection scenario: the base projection
 * (requiredCapital, retirementAge, yearsToRetirement) plus the three named
 * scenarios (docs/API.md §4) — no field invented beyond what the package
 * documents, same discipline as AnalogyScenarioSummary/
 * MultiEnvelopeScenarioSummary. requiredCapital is always shown as a
 * number; retirementAge/yearsToRetirement fall back to an explicit
 * "target not reached" message instead of formatting `null` as a figure —
 * the package's own documented pitfall (§4 ⚠).
 */
export default function FireScenarioSummary({ result }: FireScenarioSummaryProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    const renderProjection = (scenario: FireProjectionScenario) =>
        scenario.retirementAge === null || scenario.yearsToRetirement === null ? (
            <p className="text-sm text-muted-foreground">{t('scenario.fire.targetNotReached')}</p>
        ) : (
            <p className="text-sm text-muted-foreground">
                {t('scenario.fire.retirementSummary', {
                    age: scenario.retirementAge.toFixed(1),
                    years: scenario.yearsToRetirement.toFixed(1),
                })}
            </p>
        );

    const requiredCapitalByScenario = Object.fromEntries(
        SCENARIO_KEYS.map((key) => [key, result[key].requiredCapital]),
    ) as Record<ScenarioKey, number | null>;

    const yearsToRetirementByScenario = Object.fromEntries(
        SCENARIO_KEYS.map((key) => [key, result[key].yearsToRetirement]),
    ) as Record<ScenarioKey, number | null>;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('scenario.fire.summaryTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                            {t('scenario.fire.requiredCapital')}
                        </span>
                        <span className="font-mono text-lg font-semibold tabular-nums text-brand">
                            {formatCurrency(result.requiredCapital, locale)}
                        </span>
                    </div>
                    {renderProjection(result)}
                </CardContent>
            </Card>

            <Card className="gap-0 overflow-hidden py-0">
                <CardHeader className="border-b border-border py-5">
                    <CardTitle className="text-base">{t('scenario.fire.scenariosTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ul className="flex flex-col divide-y divide-border">
                        {SCENARIO_KEYS.map((key) => (
                            <li key={key} className="flex flex-col gap-1.5 px-6 py-4 text-sm">
                                <span className="font-medium">{t(`scenario.fire.scenarios.${key}`)}</span>
                                <span className="font-mono font-semibold tabular-nums text-brand">
                                    {formatCurrency(result[key].requiredCapital, locale)}
                                </span>
                                {renderProjection(result[key])}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('scenario.fire.chartTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {SCENARIO_KEYS.map((key) => (
                            <span key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span
                                    aria-hidden
                                    className="h-2.5 w-4 shrink-0 rounded-full"
                                    style={{ backgroundColor: FIRE_SCENARIO_BAR_COLORS[key] }}
                                />
                                {t(`scenario.fire.scenarios.${key}`)}
                            </span>
                        ))}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <FireScenarioBarChart
                            title={t('scenario.fire.requiredCapital')}
                            values={requiredCapitalByScenario}
                            formatValue={(value) => formatCompact(value, locale)}
                            notReachedLabel={t('scenario.fire.targetNotReachedShort')}
                        />
                        <FireScenarioBarChart
                            title={t('scenario.fire.yearsToRetirement')}
                            values={yearsToRetirementByScenario}
                            formatValue={(value) => t('scenario.fire.yearsValue', { years: value.toFixed(1) })}
                            notReachedLabel={t('scenario.fire.targetNotReachedShort')}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
