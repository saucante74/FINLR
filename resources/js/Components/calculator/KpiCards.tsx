import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { formatCurrency, type CompoundResult } from '@/lib/compound';
import { cn } from '@/lib/utils';

interface KpiCardsProps {
    result: CompoundResult;
    inflationEnabled: boolean;
}

export default function KpiCards({ result, inflationEnabled }: KpiCardsProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    return (
        <div
            className={cn(
                'grid gap-4',
                inflationEnabled
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 md:grid-cols-3',
            )}
        >
            <Card className="gap-0 overflow-hidden py-5">
                <div className="flex flex-col gap-2 px-5">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {t('kpi.totalContributions')}
                    </span>
                    <span className="text-xl font-semibold tracking-tight tabular-nums xl:text-2xl">
                        {formatCurrency(result.invested, locale)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {t('kpi.totalContributionsHint')}
                    </span>
                </div>
            </Card>

            <Card className="relative gap-0 overflow-hidden border-amber-500/30 bg-amber-500/5 py-5 dark:border-amber-400/30 dark:bg-amber-400/10">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-amber-500" />
                <div className="flex flex-col gap-2 px-5">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {t('kpi.totalGross')}
                    </span>
                    <span className="text-xl font-semibold tracking-tight tabular-nums text-amber-600 xl:text-2xl dark:text-amber-400">
                        {formatCurrency(result.finalGross, locale)}
                    </span>
                    <span className="inline-flex w-fit items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                        {t('kpi.grossGainBadge')}: {formatCurrency(result.grossGains, locale)}
                    </span>
                </div>
            </Card>

            <Card className="relative gap-0 overflow-hidden border-brand/30 bg-brand/5 py-5">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand" />
                <div className="flex flex-col gap-2 px-5">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {t('kpi.totalNet')}
                    </span>
                    <span className="text-xl font-semibold tracking-tight tabular-nums text-brand xl:text-2xl">
                        {formatCurrency(result.finalNetReal, locale)}
                    </span>
                    <span className="inline-flex w-fit items-center rounded-full bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand">
                        {t('kpi.netGainBadge')}: {formatCurrency(result.netRealGains, locale)}
                    </span>
                </div>
            </Card>

            {inflationEnabled && (
                <Card className="relative gap-0 overflow-hidden border-amber-700/30 bg-amber-700/5 py-5 dark:border-amber-600/30 dark:bg-amber-600/10">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-amber-700 dark:bg-amber-600" />
                    <div className="flex flex-col gap-2 px-5">
                        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {t('kpi.totalNetAdjusted')}
                        </span>
                        <span className="text-xl font-semibold tracking-tight tabular-nums text-amber-800 xl:text-2xl dark:text-amber-500">
                            {formatCurrency(result.finalNetRealAdjusted, locale)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {t('kpi.totalNetAdjustedHint')}
                        </span>
                    </div>
                </Card>
            )}
        </div>
    );
}
