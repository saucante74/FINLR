import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FireProjectionScenario, FireScenarioResult } from '@/features/fire-simulator/types';
import { formatCurrency } from '@/lib/currency';

interface FireScenarioSummaryProps {
    result: FireScenarioResult;
}

const SCENARIO_KEYS = ['optimistic', 'neutral', 'pessimistic'] as const;

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
        </div>
    );
}
