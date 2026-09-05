import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    SCENARIO_CHART_SERIES,
    Y_AXIS_LARGE_STEP,
    Y_AXIS_MARGIN_RATIO,
    Y_AXIS_SMALL_STEP,
    Y_AXIS_STEP_THRESHOLD,
} from '@/features/scenarios/constants';
import type { ScenarioChartSeriesKey, ScenarioResultPoint } from '@/features/scenarios/types';
import { formatCompact, formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

function niceCeil(value: number): number {
    if (value <= 0) return 1;
    const withMargin = value * (1 + Y_AXIS_MARGIN_RATIO);
    const step = withMargin < Y_AXIS_STEP_THRESHOLD ? Y_AXIS_SMALL_STEP : Y_AXIS_LARGE_STEP;
    return Math.ceil(withMargin / step) * step;
}

interface ScenarioChartProps {
    /**
     * Only `points` is read below — typed as a subset of ScenarioResult
     * rather than the full interface so callers with an equivalent
     * points-only shape (e.g. MultiEnvelopeScenarioSummary's aggregated
     * yearlyBreakdown) can reuse this chart without fabricating the other,
     * single-envelope-specific summary fields.
     */
    result: { points: ScenarioResultPoint[] };
    /** Optional subtitle rendered under the card title (e.g. MultiEnvelopeScenarioSummary's "Verdict d'abord" copy). */
    description?: string;
}

export default function ScenarioChart({ result, description }: ScenarioChartProps) {
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

    const points = result.points;
    const height = 340;
    const margin = { top: 10, right: 12, bottom: 28, left: 60 };
    const innerWidth = Math.max(width - margin.left - margin.right, 10);
    const innerHeight = height - margin.top - margin.bottom;

    const maxYear = points[points.length - 1]?.year || 1;
    const maxValue = Math.max(
        1,
        ...points.flatMap((p) => SCENARIO_CHART_SERIES.map((s) => p[s.key])),
    );
    const niceMax = niceCeil(maxValue);

    const xScale = (year: number) => (year / maxYear) * innerWidth;
    const yScale = (value: number) => innerHeight - (Math.max(value, 0) / niceMax) * innerHeight;

    const yTicks = useMemo(() => Array.from({ length: 5 }, (_, i) => (niceMax * i) / 4), [niceMax]);

    const xTickStep = Math.max(1, Math.ceil(points.length / 11));
    const xTicks = points.filter((_, i) => i % xTickStep === 0 || i === points.length - 1);

    const areaPath = (key: ScenarioChartSeriesKey) => {
        const coords = points.map((p) => [xScale(p.year), yScale(p[key])]);
        const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
        const first = coords[0];
        const last = coords[coords.length - 1];
        return `${line} L${last[0]},${innerHeight} L${first[0]},${innerHeight} Z`;
    };

    const linePath = (key: ScenarioChartSeriesKey) =>
        points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(p.year)},${yScale(p[key])}`).join(' ');

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const x = event.clientX - rect.left - margin.left;
        const ratio = Math.min(Math.max(x / innerWidth, 0), 1);
        const index = Math.round(ratio * (points.length - 1));
        setHoverIndex(Math.min(Math.max(index, 0), points.length - 1));
    };

    const hoverPoint: ScenarioResultPoint | null = hoverIndex !== null ? points[hoverIndex] : null;
    const hoverX = hoverPoint ? margin.left + xScale(hoverPoint.year) : 0;
    const tooltipLeft = Math.min(Math.max(hoverX, 90), width - 90);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('scenario.chart.title')}</CardTitle>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    {SCENARIO_CHART_SERIES.map((s) => (
                        <span key={s.key} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span
                                aria-hidden
                                className={cn(
                                    'h-2.5 w-4 rounded-full',
                                    s.dashed && 'border-b-2 border-dashed bg-transparent',
                                )}
                                style={s.dashed ? { borderColor: s.color } : { backgroundColor: s.color }}
                            />
                            {t(s.labelKey)}
                        </span>
                    ))}
                </div>

                <div
                    ref={containerRef}
                    className="relative h-[340px] w-full"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <svg width={width} height={height}>
                        <g transform={`translate(${margin.left},${margin.top})`}>
                            <defs>
                                {SCENARIO_CHART_SERIES.map((s) => (
                                    <linearGradient key={s.key} id={`scenario-fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                                        <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                                    </linearGradient>
                                ))}
                            </defs>

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

                            {SCENARIO_CHART_SERIES.map((s) => (
                                <path
                                    key={`area-${s.key}`}
                                    d={areaPath(s.key)}
                                    fill={`url(#scenario-fill-${s.key})`}
                                    stroke="none"
                                />
                            ))}
                            {SCENARIO_CHART_SERIES.map((s) => (
                                <path
                                    key={`line-${s.key}`}
                                    d={linePath(s.key)}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth={s.key === 'netReal' ? 2.5 : 2}
                                    strokeDasharray={s.dashed ? '6 4' : undefined}
                                />
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
                                    {SCENARIO_CHART_SERIES.map((s) => (
                                        <circle
                                            key={s.key}
                                            cx={xScale(hoverPoint.year)}
                                            cy={yScale(hoverPoint[s.key])}
                                            r={3.5}
                                            fill={s.color}
                                        />
                                    ))}
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
                                {SCENARIO_CHART_SERIES.map((s) => (
                                    <li key={s.key} className="flex items-center justify-between gap-4 text-xs">
                                        <span className="flex items-center gap-1.5">
                                            <span
                                                aria-hidden
                                                className="size-2 rounded-full"
                                                style={{ backgroundColor: s.color }}
                                            />
                                            {t(s.labelKey)}
                                        </span>
                                        <span className="font-medium tabular-nums">
                                            {formatCurrency(hoverPoint[s.key], locale)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
