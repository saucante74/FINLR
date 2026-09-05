import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import type {
    AccountType,
    MultiEnvelopeScenarioInput,
    MultiEnvelopeScenarioResult,
} from '@/features/multi-envelope-simulator/types';
import ScenarioChart from '@/features/scenarios/components/ScenarioChart';
import { ACCOUNT_TYPE_CHART_COLORS, SCENARIO_CHART_SERIES } from '@/features/scenarios/constants';
import type { ScenarioResultPoint } from '@/features/scenarios/types';
import { formatCompact, formatCurrency } from '@/lib/currency';

/**
 * Cosmetic-only ranges used to position the decorative "Hypothèses" sliders
 * (see DecorativeHypothesisRow below) — durationYears/annualReturnRate mirror
 * ENVELOPE_FIELD_CONFIG's real slider bounds
 * (features/multi-envelope-simulator/lib/envelopeFields.ts); monthlyContribution
 * has no such bound in the real form (it's an open AmountField), and
 * inflationRate's bound lives inline in MultiEnvelopeForm.tsx (its slider's
 * max), not in a shared config — both are approximated here for a plausible
 * dot position only, never for the displayed value itself.
 */
const DURATION_BOUNDS = { min: 1, max: 40 };
const RETURN_RATE_BOUNDS = { min: 0, max: 15 };
const CONTRIBUTION_BOUNDS = { min: 0, max: 2000 };
const INFLATION_BOUNDS = { min: 0, max: 50 };

function clampToRange(value: number, { min, max }: { min: number; max: number }): number {
    if (max <= min) return 0;
    return Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
}

function formatPercent(value: number, locale?: string, digits = 1): string {
    const safeValue = Number.isFinite(value) ? value : 0;
    return `${safeValue.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;
}

function formatMultiplier(value: number, locale?: string): string {
    return `×${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface StatTileProps {
    label: string;
    help: string;
    value: string;
}

function StatTile({ label, help, value }: StatTileProps) {
    return (
        <div className="flex flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
            <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
            <span className="text-xs text-muted-foreground">{help}</span>
        </div>
    );
}

interface DecorativeHypothesisRowProps {
    label: string;
    value: string;
    position: number;
}

/**
 * Read-only, non-interactive row for the "Hypothèses" panel: the slider is
 * purely decorative (pointer-events disabled, not focusable), reproducing
 * the mockup's visual without implying a live-recompute capability the app
 * doesn't have (the result page shows a saved, static scenario — there is no
 * recompute endpoint).
 */
function DecorativeHypothesisRow({ label, value, position }: DecorativeHypothesisRowProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-medium tabular-nums">{value}</span>
            </div>
            <Slider
                value={[position]}
                min={0}
                max={100}
                aria-hidden
                tabIndex={-1}
                className="pointer-events-none [&_[data-slot=slider-thumb]]:shadow-none"
            />
        </div>
    );
}

interface MultiEnvelopeScenarioSummaryProps {
    result: MultiEnvelopeScenarioResult;
    input: MultiEnvelopeScenarioInput;
}

/**
 * "Verdict d'abord" layout (blueprints/simulators_multi-envelope-scenario.pdf,
 * proposal 1a — the other proposal, "Pilotage", is intentionally not
 * implemented here). Every figure below is either a real field from
 * PocketResultData/YearlyResultData (docs/API.md §2) or a simple arithmetic
 * derivative of two such fields (a ratio, a difference, a sum) — nothing the
 * engine doesn't already compute. Three mockup elements were not carried
 * over after review because no real data backs them: "TRI net" (a true
 * annualized/IRR return isn't exposed anywhere and approximating one would
 * mean reimplementing financial-engine logic in the frontend, against
 * CLAUDE.md's cardinal rule) was replaced by "Frais cumulés" (a real,
 * already-available aggregate); "Dupliquer" and "Partager" (no such
 * scenario features exist) were dropped, "Exporter en PDF" kept but
 * disabled; the "Hypothèses" panel's live-recompute affordance ("Modifiez-les,
 * tout se recalcule") was replaced with a read-only display — the sliders
 * are purely decorative (non-interactive, no recompute endpoint exists).
 */
export default function MultiEnvelopeScenarioSummary({ result, input }: MultiEnvelopeScenarioSummaryProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    const { summary, pockets } = result;
    const { totalDeposited, netBalance, grossBalance, realNetBalanceWithInflation, year: years } = summary;

    const netGains = netBalance - totalDeposited;
    const grossGains = grossBalance - totalDeposited;
    const totalTax = grossBalance - netBalance;
    const inflationCost = netBalance - realNetBalanceWithInflation;
    const multiplier = totalDeposited > 0 ? netBalance / totalDeposited : null;

    const chartPoints: ScenarioResultPoint[] = result.yearlyBreakdown.map((yearPoint) => ({
        year: yearPoint.year,
        contributions: yearPoint.totalDeposited,
        gross: yearPoint.grossBalance,
        netReal: yearPoint.netBalance,
        netRealAdjusted: yearPoint.realNetBalanceWithInflation,
    }));

    // Reuses the 3 colors already established for the aggregated chart above
    // (SCENARIO_CHART_SERIES) instead of a new ad hoc palette: gray already
    // means "amounts contributed", green already means "capital net réel",
    // and orange already carries the "cost" reading (netRealAdjusted) in
    // that same chart's legend.
    const colorOf = (key: string) => SCENARIO_CHART_SERIES.find((series) => series.key === key)!.color;
    const depositsColor = colorOf('contributions');
    const gainsColor = colorOf('netReal');
    const taxColor = colorOf('netRealAdjusted');

    const depositsShare = grossBalance > 0 ? (totalDeposited / grossBalance) * 100 : 0;
    const gainsShare = grossBalance > 0 ? (netGains / grossBalance) * 100 : 0;
    const taxShare = grossBalance > 0 ? (totalTax / grossBalance) * 100 : 0;

    const taxedPockets = pockets.filter((pocket) => pocket.taxesAmount > 0);
    const taxNote =
        taxedPockets.length === 1
            ? t('scenario.multiEnvelope.verdict.breakdown.taxNoteNamed', {
                  percent: formatPercent(
                      taxedPockets[0].totalGains > 0 ? (taxedPockets[0].taxesAmount / taxedPockets[0].totalGains) * 100 : 0,
                      locale,
                  ),
                  accountType: t(`simulator.multiEnvelope.accountTypes.${taxedPockets[0].accountType}`),
              })
            : t('scenario.multiEnvelope.verdict.breakdown.taxNoteBlended', {
                  percent: formatPercent(grossGains > 0 ? (totalTax / grossGains) * 100 : 0, locale),
              });

    const feesSharePercent = grossGains > 0 ? (result.totalFeesAmount / grossGains) * 100 : 0;
    const inflationRatePercent = (input.envelopes[0]?.inflationRate ?? 0) * 100;
    const duration = `${years} ${t('form.yearsUnit', { count: years })}`;

    const accountTypeLabel = (accountType: AccountType) => t(`simulator.multiEnvelope.accountTypes.${accountType}`);

    return (
        <div className="flex flex-col gap-6">
            <Card className="border-brand/30 bg-brand/5">
                <CardContent className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex max-w-xl flex-col gap-3">
                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            {t('scenario.multiEnvelope.verdict.heroLabel', { duration })}
                        </span>
                        <div className="flex flex-wrap items-baseline gap-3">
                            <span className="font-mono text-4xl font-semibold tabular-nums text-brand lg:text-5xl">
                                {formatCurrency(netBalance, locale)}
                            </span>
                            {multiplier !== null && (
                                <span className="rounded-full bg-brand/15 px-2.5 py-1 font-mono text-sm font-semibold text-brand">
                                    {formatMultiplier(multiplier, locale)}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('scenario.multiEnvelope.verdict.narrative', {
                                deposited: formatCurrency(totalDeposited, locale),
                                netGains: formatCurrency(netGains, locale),
                                realNet: formatCurrency(realNetBalanceWithInflation, locale),
                            })}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                        <StatTile
                            label={t('scenario.multiEnvelope.verdict.stats.netGain')}
                            help={t('scenario.multiEnvelope.verdict.stats.netGainHelp')}
                            value={formatCurrency(netGains, locale)}
                        />
                        <StatTile
                            label={t('scenario.multiEnvelope.verdict.stats.totalFees')}
                            help={t('scenario.multiEnvelope.verdict.stats.totalFeesHelp')}
                            value={formatCurrency(result.totalFeesAmount, locale)}
                        />
                        <StatTile
                            label={t('scenario.multiEnvelope.verdict.stats.realNet')}
                            help={t('scenario.multiEnvelope.verdict.stats.realNetHelp', {
                                rate: formatPercent(inflationRatePercent, locale),
                            })}
                            value={formatCurrency(realNetBalanceWithInflation, locale)}
                        />
                        <StatTile
                            label={t('scenario.multiEnvelope.verdict.stats.inflationCost')}
                            help={t('scenario.multiEnvelope.verdict.stats.inflationCostHelp', { duration })}
                            value={`− ${formatCurrency(inflationCost, locale)}`}
                        />
                    </div>
                </CardContent>
            </Card>

            {chartPoints.length > 0 && (
                <ScenarioChart result={{ points: chartPoints }} description={t('scenario.multiEnvelope.verdict.chartSubtitle')} />
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('scenario.multiEnvelope.verdict.breakdown.title')}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('scenario.multiEnvelope.verdict.breakdown.subtitle', { amount: formatCurrency(grossBalance, locale) })}
                    </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div style={{ width: `${depositsShare}%`, backgroundColor: depositsColor }} />
                        <div style={{ width: `${gainsShare}%`, backgroundColor: gainsColor }} />
                        <div style={{ width: `${taxShare}%`, backgroundColor: taxColor }} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: depositsColor }} />
                                {t('scenario.multiEnvelope.verdict.breakdown.deposits')}
                            </span>
                            <span className="font-mono text-lg font-semibold tabular-nums">{formatCurrency(totalDeposited, locale)}</span>
                            <span className="text-xs text-muted-foreground">
                                {t('scenario.multiEnvelope.verdict.breakdown.share', { percent: formatPercent(depositsShare, locale, 0) })}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: gainsColor }} />
                                {t('scenario.multiEnvelope.verdict.breakdown.gains')}
                            </span>
                            <span className="font-mono text-lg font-semibold tabular-nums">{formatCurrency(netGains, locale)}</span>
                            <span className="text-xs text-muted-foreground">
                                {t('scenario.multiEnvelope.verdict.breakdown.share', { percent: formatPercent(gainsShare, locale, 0) })}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: taxColor }} />
                                {t('scenario.multiEnvelope.verdict.breakdown.tax')}
                            </span>
                            <span className="font-mono text-lg font-semibold tabular-nums">{formatCurrency(totalTax, locale)}</span>
                            <span className="text-xs text-muted-foreground">{taxNote}</span>
                        </div>
                    </div>

                    <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                        {t('scenario.multiEnvelope.verdict.breakdown.feesNote', {
                            amount: formatCurrency(result.totalFeesAmount, locale),
                            percent: formatPercent(feesSharePercent, locale, 0),
                        })}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('scenario.multiEnvelope.verdict.hypotheses.title')}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t('scenario.multiEnvelope.verdict.hypotheses.subtitle')}</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {input.envelopes.map((envelope, index) => (
                        <div key={index} className="flex flex-col gap-4">
                            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                {accountTypeLabel(envelope.accountType)}
                            </span>
                            <DecorativeHypothesisRow
                                label={t('simulator.multiEnvelope.form.fields.annualReturnRate.label')}
                                value={formatPercent(envelope.annualReturnRate * 100, locale)}
                                position={clampToRange(envelope.annualReturnRate * 100, RETURN_RATE_BOUNDS)}
                            />
                            <DecorativeHypothesisRow
                                label={t('simulator.multiEnvelope.form.fields.monthlyContribution.label')}
                                value={formatCurrency(envelope.monthlyContribution, locale)}
                                position={clampToRange(envelope.monthlyContribution, CONTRIBUTION_BOUNDS)}
                            />
                            <DecorativeHypothesisRow
                                label={t('simulator.multiEnvelope.form.fields.durationYears.label')}
                                value={`${envelope.durationYears} ${t('form.yearsUnit', { count: envelope.durationYears })}`}
                                position={clampToRange(envelope.durationYears, DURATION_BOUNDS)}
                            />
                        </div>
                    ))}

                    <DecorativeHypothesisRow
                        label={t('simulator.multiEnvelope.form.fields.inflationRate.label')}
                        value={formatPercent(inflationRatePercent, locale)}
                        position={clampToRange(inflationRatePercent, INFLATION_BOUNDS)}
                    />
                </CardContent>
            </Card>

            <Card className="gap-0 overflow-hidden py-0">
                <CardHeader className="border-b border-border py-5">
                    <CardTitle className="text-base">{t('scenario.multiEnvelope.pocketsTitle')}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t('scenario.multiEnvelope.verdict.detail.subtitle')}</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                            {pockets.map((pocket, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: `${grossBalance > 0 ? (pocket.grossBalance / grossBalance) * 100 : 0}%`,
                                        backgroundColor: ACCOUNT_TYPE_CHART_COLORS[pocket.accountType],
                                    }}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {pockets
                                .map(
                                    (pocket) =>
                                        `${accountTypeLabel(pocket.accountType)} ${formatPercent(
                                            grossBalance > 0 ? (pocket.grossBalance / grossBalance) * 100 : 0,
                                            locale,
                                            0,
                                        )}`,
                                )
                                .join(' · ')}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        {/*
                         * Compacted to push the horizontal-scroll threshold from 3 to ~4-5
                         * envelopes: amounts use formatCompact (already established for
                         * ScenarioChart's axis ticks and FireScenarioSummary's bar labels,
                         * reused here rather than inventing a second compact formatter),
                         * column padding is tighter (px-2 instead of px-4), and the header
                         * row matches AnalogyScenarioSummary's existing dense-table type
                         * scale (text-[11px] uppercase) instead of introducing a new one.
                         * The 3 longest row labels (Frais cumulés, Régime fiscal, Impôt à la
                         * sortie) are shortened for display, with the full label kept as a
                         * native tooltip (title) so meaning isn't lost.
                         */}
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                    <th className="py-2 pr-2">{t('scenario.multiEnvelope.verdict.detail.poste')}</th>
                                    {pockets.map((pocket, index) => (
                                        <th key={index} className="px-2 py-2 text-right">
                                            {accountTypeLabel(pocket.accountType)}
                                        </th>
                                    ))}
                                    <th className="py-2 pl-2 text-right">{t('scenario.multiEnvelope.verdict.detail.total')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr>
                                    <td className="py-2.5 pr-2 text-muted-foreground">
                                        {t('scenario.multiEnvelope.verdict.detail.rows.deposits')}
                                    </td>
                                    {pockets.map((pocket, index) => (
                                        <td key={index} className="px-2 py-2.5 text-right font-mono tabular-nums">
                                            {formatCompact(pocket.totalDeposited, locale)}
                                        </td>
                                    ))}
                                    <td className="py-2.5 pl-2 text-right font-mono font-medium tabular-nums">
                                        {formatCompact(totalDeposited, locale)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 pr-2 text-muted-foreground">
                                        {t('scenario.multiEnvelope.verdict.detail.rows.grossGains')}
                                    </td>
                                    {pockets.map((pocket, index) => (
                                        <td key={index} className="px-2 py-2.5 text-right font-mono tabular-nums">
                                            {formatCompact(pocket.totalGains, locale)}
                                        </td>
                                    ))}
                                    <td className="py-2.5 pl-2 text-right font-mono font-medium tabular-nums">
                                        {formatCompact(grossGains, locale)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 pr-2 text-muted-foreground">
                                        {t('scenario.multiEnvelope.verdict.detail.rows.grossBalance')}
                                    </td>
                                    {pockets.map((pocket, index) => (
                                        <td key={index} className="px-2 py-2.5 text-right font-mono tabular-nums">
                                            {formatCompact(pocket.grossBalance, locale)}
                                        </td>
                                    ))}
                                    <td className="py-2.5 pl-2 text-right font-mono font-medium tabular-nums">
                                        {formatCompact(grossBalance, locale)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 pr-2 text-muted-foreground" title={t('scenario.multiEnvelope.verdict.detail.rows.fees')}>
                                        {t('scenario.multiEnvelope.verdict.detail.rows.feesShort')}
                                    </td>
                                    {pockets.map((pocket, index) => (
                                        <td key={index} className="px-2 py-2.5 text-right font-mono tabular-nums text-destructive">
                                            − {formatCompact(pocket.totalFeesAmount, locale)}
                                        </td>
                                    ))}
                                    <td className="py-2.5 pl-2 text-right font-mono font-medium tabular-nums text-destructive">
                                        − {formatCompact(result.totalFeesAmount, locale)}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="py-2.5 pr-2 text-muted-foreground"
                                        title={t('scenario.multiEnvelope.verdict.detail.rows.taxRegime')}
                                    >
                                        {t('scenario.multiEnvelope.verdict.detail.rows.taxRegimeShort')}
                                    </td>
                                    {pockets.map((pocket, index) => (
                                        <td key={index} className="px-2 py-2.5 text-right">
                                            {t(`scenario.multiEnvelope.taxRegimes.${pocket.taxRegime}`)}
                                            {pocket.taxesAmount > 0 &&
                                                pocket.totalGains > 0 &&
                                                ` ${formatPercent((pocket.taxesAmount / pocket.totalGains) * 100, locale, 0)}`}
                                        </td>
                                    ))}
                                    <td className="py-2.5 pl-2 text-right text-muted-foreground">—</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 pr-2 text-muted-foreground" title={t('scenario.multiEnvelope.verdict.detail.rows.tax')}>
                                        {t('scenario.multiEnvelope.verdict.detail.rows.taxShort')}
                                    </td>
                                    {pockets.map((pocket, index) => (
                                        <td key={index} className="px-2 py-2.5 text-right font-mono tabular-nums text-destructive">
                                            − {formatCompact(pocket.taxesAmount, locale)}
                                        </td>
                                    ))}
                                    <td className="py-2.5 pl-2 text-right font-mono font-medium tabular-nums text-destructive">
                                        − {formatCompact(totalTax, locale)}
                                    </td>
                                </tr>
                                <tr className="font-semibold">
                                    <td className="py-2.5 pr-2">{t('scenario.multiEnvelope.verdict.detail.rows.netBalance')}</td>
                                    {pockets.map((pocket, index) => (
                                        <td key={index} className="px-2 py-2.5 text-right font-mono tabular-nums text-brand">
                                            {formatCompact(pocket.netBalance, locale)}
                                        </td>
                                    ))}
                                    <td className="py-2.5 pl-2 text-right font-mono tabular-nums text-brand">
                                        {formatCompact(netBalance, locale)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
