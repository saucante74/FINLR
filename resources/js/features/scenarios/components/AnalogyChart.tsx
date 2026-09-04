import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalogyScenarioResult, AnalogyYearlyPoint } from '@/features/analogy-simulator/types';
import {
    ANALOGY_CHART_COLORS,
    Y_AXIS_LARGE_STEP,
    Y_AXIS_MARGIN_RATIO,
    Y_AXIS_SMALL_STEP,
    Y_AXIS_STEP_THRESHOLD,
} from '@/features/scenarios/constants';
import { formatCompact, formatCurrency } from '@/lib/currency';

function niceCeil(value: number): number {
    if (value <= 0) return 1;
    const withMargin = value * (1 + Y_AXIS_MARGIN_RATIO);
    const step = withMargin < Y_AXIS_STEP_THRESHOLD ? Y_AXIS_SMALL_STEP : Y_AXIS_LARGE_STEP;
    return Math.ceil(withMargin / step) * step;
}

interface AnalogyChartProps {
    result: AnalogyScenarioResult;
}

/**
 * Year-by-year trajectory of the reference metric (realNetBalanceWithInflation)
 * for both scenarios — legitimate here, unlike FIRE's result view, because
 * AnalogyResult actually carries a yearlyBreakdown (docs/API.md §3), so
 * nothing is guessed or recomputed. Reuses ScenarioChart.tsx's own SVG/
 * ResizeObserver/hover-tooltip pattern rather than a new charting
 * dependency. Crossover years (result.crossoverYears) get a vertical
 * guideline; a ceiling event on either scenario's line (ceilingEventsA/B)
 * gets a ringed marker on that line at that year — both purely
 * restitutions of fields the package already returns, not derived data.
 */
export default function AnalogyChart({ result }: AnalogyChartProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(600);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

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

    const points = result.yearlyBreakdown;
    const height = 340;
    const margin = { top: 10, right: 12, bottom: 28, left: 60 };
    const innerWidth = Math.max(width - margin.left - margin.right, 10);
    const innerHeight = height - margin.top - margin.bottom;

    const maxYear = points[points.length - 1]?.year || 1;
    const maxValue = Math.max(
        1,
        ...points.flatMap((p) => [p.realNetBalanceWithInflation.valueA, p.realNetBalanceWithInflation.valueB]),
    );
    const niceMax = niceCeil(maxValue);

    const xScale = (year: number) => (year / maxYear) * innerWidth;
    const yScale = (value: number) => innerHeight - (Math.max(value, 0) / niceMax) * innerHeight;

    const yTicks = useMemo(() => Array.from({ length: 5 }, (_, i) => (niceMax * i) / 4), [niceMax]);

    const xTickStep = Math.max(1, Math.ceil(points.length / 11));
    const xTicks = points.filter((_, i) => i % xTickStep === 0 || i === points.length - 1);

    const crossoverYears = useMemo(() => new Set(result.crossoverYears), [result.crossoverYears]);

    const linePath = (key: 'valueA' | 'valueB') =>
        points
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(p.year)},${yScale(p.realNetBalanceWithInflation[key])}`)
            .join(' ');

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const x = event.clientX - rect.left - margin.left;
        const ratio = Math.min(Math.max(x / innerWidth, 0), 1);
        const index = Math.round(ratio * (points.length - 1));
        setHoverIndex(Math.min(Math.max(index, 0), points.length - 1));
    };

    const hoverPoint: AnalogyYearlyPoint | null = hoverIndex !== null ? points[hoverIndex] : null;
    const hoverX = hoverPoint ? margin.left + xScale(hoverPoint.year) : 0;
    const tooltipLeft = Math.min(Math.max(hoverX, 90), width - 90);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{t('scenario.analogy.chartTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                            aria-hidden
                            className="h-2.5 w-4 rounded-full"
                            style={{ backgroundColor: ANALOGY_CHART_COLORS.A }}
                        />
                        {result.labelA}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                            aria-hidden
                            className="h-2.5 w-4 rounded-full"
                            style={{ backgroundColor: ANALOGY_CHART_COLORS.B }}
                        />
                        {result.labelB}
                    </span>
                    {result.hasCrossover && (
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span aria-hidden className="h-2.5 w-0.5 rounded-full bg-muted-foreground/60" />
                            {t('scenario.analogy.chartCrossoverLegend')}
                        </span>
                    )}
                </div>

                <div
                    ref={containerRef}
                    className="relative h-[340px] w-full"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <svg width={width} height={height}>
                        <g transform={`translate(${margin.left},${margin.top})`}>
                            {yTicks.map((tick) => (
                                <g key={tick}>
                                    <line
                                        x1={0}
                                        x2={innerWidth}
                                        y1={yScale(tick)}
                                        y2={yScale(tick)}
                                        stroke="var(--border)"
                                        strokeDasharray="3 3"
                                    />
                                    <text
                                        x={-8}
                                        y={yScale(tick)}
                                        dy="0.32em"
                                        textAnchor="end"
                                        fontSize={12}
                                        fill="var(--muted-foreground)"
                                    >
                                        {formatCompact(tick, locale)}
                                    </text>
                                </g>
                            ))}

                            {xTicks.map((p) => (
                                <text
                                    key={p.year}
                                    x={xScale(p.year)}
                                    y={innerHeight + 20}
                                    textAnchor="middle"
                                    fontSize={12}
                                    fill="var(--muted-foreground)"
                                >
                                    {t('scenario.chart.yearTick', { count: p.year })}
                                </text>
                            ))}

                            {points
                                .filter((p) => crossoverYears.has(p.year))
                                .map((p) => (
                                    <line
                                        key={`crossover-${p.year}`}
                                        x1={xScale(p.year)}
                                        x2={xScale(p.year)}
                                        y1={0}
                                        y2={innerHeight}
                                        stroke="var(--muted-foreground)"
                                        strokeOpacity={0.5}
                                        strokeDasharray="4 3"
                                    />
                                ))}

                            <path d={linePath('valueA')} fill="none" stroke={ANALOGY_CHART_COLORS.A} strokeWidth={2.5} />
                            <path d={linePath('valueB')} fill="none" stroke={ANALOGY_CHART_COLORS.B} strokeWidth={2.5} />

                            {points.map((p) => (
                                <g key={`ceiling-${p.year}`}>
                                    {p.ceilingEventsA.length > 0 && (
                                        <circle
                                            cx={xScale(p.year)}
                                            cy={yScale(p.realNetBalanceWithInflation.valueA)}
                                            r={5}
                                            fill="var(--background)"
                                            stroke={ANALOGY_CHART_COLORS.A}
                                            strokeWidth={2}
                                        />
                                    )}
                                    {p.ceilingEventsB.length > 0 && (
                                        <circle
                                            cx={xScale(p.year)}
                                            cy={yScale(p.realNetBalanceWithInflation.valueB)}
                                            r={5}
                                            fill="var(--background)"
                                            stroke={ANALOGY_CHART_COLORS.B}
                                            strokeWidth={2}
                                        />
                                    )}
                                </g>
                            ))}

                            {hoverPoint && (
                                <g>
                                    <line
                                        x1={xScale(hoverPoint.year)}
                                        x2={xScale(hoverPoint.year)}
                                        y1={0}
                                        y2={innerHeight}
                                        stroke="var(--border)"
                                    />
                                    <circle
                                        cx={xScale(hoverPoint.year)}
                                        cy={yScale(hoverPoint.realNetBalanceWithInflation.valueA)}
                                        r={3.5}
                                        fill={ANALOGY_CHART_COLORS.A}
                                    />
                                    <circle
                                        cx={xScale(hoverPoint.year)}
                                        cy={yScale(hoverPoint.realNetBalanceWithInflation.valueB)}
                                        r={3.5}
                                        fill={ANALOGY_CHART_COLORS.B}
                                    />
                                </g>
                            )}
                        </g>
                    </svg>

                    {hoverPoint && (
                        <div
                            className="pointer-events-none absolute top-2 min-w-44 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md"
                            style={{ left: tooltipLeft }}
                        >
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                                {t('scenario.chart.tooltipYear', { year: hoverPoint.year })}
                            </p>
                            <ul className="flex flex-col gap-1.5">
                                <li className="flex items-center justify-between gap-4 text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            aria-hidden
                                            className="size-2 rounded-full"
                                            style={{ backgroundColor: ANALOGY_CHART_COLORS.A }}
                                        />
                                        {result.labelA}
                                    </span>
                                    <span className="font-medium tabular-nums">
                                        {formatCurrency(hoverPoint.realNetBalanceWithInflation.valueA, locale)}
                                    </span>
                                </li>
                                <li className="flex items-center justify-between gap-4 text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            aria-hidden
                                            className="size-2 rounded-full"
                                            style={{ backgroundColor: ANALOGY_CHART_COLORS.B }}
                                        />
                                        {result.labelB}
                                    </span>
                                    <span className="font-medium tabular-nums">
                                        {formatCurrency(hoverPoint.realNetBalanceWithInflation.valueB, locale)}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
