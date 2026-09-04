import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MultiEnvelopeScenarioResult } from '@/features/multi-envelope-simulator/types';
import { formatCurrency } from '@/lib/currency';

interface MultiEnvelopeScenarioSummaryProps {
    result: MultiEnvelopeScenarioResult;
}

/**
 * First, minimal result view for a saved multi-envelope scenario: headline
 * figures plus one line per pocket. Not the full "4 vues de détail dédiées"
 * generalisation from RAPPORT.md §6.3 (that still awaits Analogy and Fire),
 * just enough for a multi-envelope scenario to render something coherent
 * instead of the single-envelope view's chart/table, which read
 * CalculationResultData's own shape and would break on this one.
 */
export default function MultiEnvelopeScenarioSummary({ result }: MultiEnvelopeScenarioSummaryProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

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

            <Card className="gap-0 overflow-hidden py-0">
                <CardHeader className="border-b border-border py-5">
                    <CardTitle className="text-base">{t('scenario.multiEnvelope.pocketsTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ul className="flex flex-col divide-y divide-border">
                        {result.pockets.map((pocket, index) => (
                            <li key={index} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                                <span className="font-medium">
                                    {t(`simulator.multiEnvelope.accountTypes.${pocket.accountType}`)}
                                </span>
                                <span className="text-muted-foreground">
                                    {formatCurrency(pocket.totalDeposited, locale)}
                                </span>
                                <span className="font-mono font-semibold tabular-nums text-brand">
                                    {formatCurrency(pocket.netBalance, locale)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
