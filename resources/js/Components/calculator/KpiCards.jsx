import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/compound';
import { cn } from '@/lib/utils';

export default function KpiCards({ result }) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage;

    const items = [
        {
            key: 'invested',
            label: t('kpi.invested'),
            value: result.invested,
            hint: t('kpi.investedHint'),
            accent: false,
        },
        {
            key: 'grossGains',
            label: t('kpi.grossGains'),
            value: result.grossGains,
            hint: t('kpi.grossGainsHint'),
            accent: false,
        },
        {
            key: 'finalGross',
            label: t('kpi.finalGross'),
            value: result.finalGross,
            hint: t('kpi.finalGrossHint'),
            accent: false,
        },
        {
            key: 'netRealGains',
            label: t('kpi.netRealGains'),
            value: result.netRealGains,
            hint: t('kpi.netRealGainsHint'),
            accent: true,
        },
        {
            key: 'finalNetReal',
            label: t('kpi.finalNetReal'),
            value: result.finalNetReal,
            hint: t('kpi.finalNetRealHint'),
            accent: true,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
                <Card
                    key={item.key}
                    className={cn(
                        'relative gap-0 overflow-hidden py-5',
                        item.accent && 'border-brand/30 bg-brand/5',
                    )}
                >
                    {item.accent && (
                        <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-1 bg-brand"
                        />
                    )}
                    <div className="flex flex-col gap-2 px-5">
                        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {item.label}
                        </span>
                        <span
                            className={cn(
                                'text-xl font-semibold tracking-tight tabular-nums xl:text-2xl',
                                item.accent && 'text-brand',
                            )}
                        >
                            {formatCurrency(item.value, locale)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {item.hint}
                        </span>
                    </div>
                </Card>
            ))}
        </div>
    );
}
