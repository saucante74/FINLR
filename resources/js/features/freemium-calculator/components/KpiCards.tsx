import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import type { CompoundResult } from '@/features/freemium-calculator/types';
import { formatCurrency } from '@/lib/currency';
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
            <Card className="relative gap-0 overflow-hidden border-slate-500/30 bg-slate-500/5 py-5 dark:border-slate-400/30 dark:bg-slate-400/10">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-slate-500" />
                <div className="flex flex-col gap-2 px-5">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {t('kpi.totalContributions')}
                    </span>
                    <span className="text-xl font-semibold tracking-tight tabular-nums text-slate-600 xl:text-2xl dark:text-slate-400">
                        {formatCurrency(result.invested, locale)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {t('kpi.totalContributionsHint')}
                    </span>
                </div>
            </Card>

            <Card className="relative gap-0 overflow-hidden border-violet-500/30 bg-violet-500/5 py-5 dark:border-violet-400/30 dark:bg-violet-400/10">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-violet-500" />
                <div className="flex flex-col gap-2 px-5">
                    <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {t('kpi.totalGross')}
                        <span title={t('kpi.totalGrossInfo')} className="inline-flex shrink-0">
                            <Info className="size-3.5 normal-case" />
                        </span>
                    </span>
                    <span className="text-xl font-semibold tracking-tight tabular-nums text-violet-600 xl:text-2xl dark:text-violet-400">
                        {formatCurrency(result.finalGross, locale)}
                    </span>
                    <span className="inline-flex w-fit items-center rounded-full bg-violet-500/15 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-400">
                        {t('kpi.grossGainBadge')}: {formatCurrency(result.grossGains, locale)}
                    </span>
                </div>
            </Card>

            <Card className="relative gap-0 overflow-hidden border-emerald-500/30 bg-emerald-500/5 py-5 dark:border-emerald-400/30 dark:bg-emerald-400/10">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
                <div className="flex flex-col gap-2 px-5">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {t('kpi.totalNet')}
                    </span>
                    <span className="text-xl font-semibold tracking-tight tabular-nums text-emerald-600 xl:text-2xl dark:text-emerald-400">
                        {formatCurrency(result.finalNetReal, locale)}
                    </span>
                    <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        {t('kpi.netGainBadge')}: {formatCurrency(result.netRealGains, locale)}
                    </span>
                </div>
            </Card>

            {inflationEnabled && (
                <Card className="relative gap-0 overflow-hidden border-orange-500/30 bg-orange-500/5 py-5 dark:border-orange-400/30 dark:bg-orange-400/10">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-orange-500" />
                    <div className="flex flex-col gap-2 px-5">
                        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {t('kpi.totalNetAdjusted')}
                        </span>
                        <span className="text-xl font-semibold tracking-tight tabular-nums text-orange-600 xl:text-2xl dark:text-orange-400">
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
