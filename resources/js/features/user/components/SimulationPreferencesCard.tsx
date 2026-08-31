import { useTranslation } from 'react-i18next';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CURRENCIES, CURRENCY } from '@/lib/currency';

export default function SimulationPreferencesCard() {
    const { t } = useTranslation();

    return (
        <Card className="gap-0 py-0">
            <CardHeader className="gap-1.5 border-b border-border py-5">
                <div className="flex items-baseline gap-2">
                    <span aria-hidden className="font-mono text-xs text-brand">
                        03
                    </span>
                    <CardTitle className="text-base">
                        {t('settings.simulationPreferences.title')}
                    </CardTitle>
                </div>
                <CardDescription>
                    {t('settings.simulationPreferences.description')}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 py-6">
                <Label htmlFor="simulation-currency">
                    {t('settings.simulationPreferences.currency.label')}
                </Label>

                <Select value={CURRENCY}>
                    <SelectTrigger id="simulation-currency" className="w-64">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {CURRENCIES.map((currency) => {
                            const active = currency.code === CURRENCY;

                            return (
                                <SelectItem
                                    key={currency.code}
                                    value={currency.code}
                                    disabled={!active}
                                    title={
                                        active
                                            ? undefined
                                            : t(
                                                  'settings.simulationPreferences.currency.comingSoon',
                                              )
                                    }
                                >
                                    {currency.symbol}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                    {t('settings.simulationPreferences.currency.hint')}
                </p>
            </CardContent>
        </Card>
    );
}
