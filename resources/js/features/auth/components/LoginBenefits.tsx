import { useTranslation } from 'react-i18next';

import { Card, CardContent } from '@/components/ui/card';

const BENEFIT_KEYS = [
    'savedScenarios',
    'envelopeComparison',
    'exportSharing',
] as const;

export default function LoginBenefits() {
    const { t } = useTranslation();

    return (
        <div className="flex w-full max-w-md flex-col gap-4">
            <Card className="gap-0 py-0">
                <CardContent className="flex flex-col gap-6 py-6">
                    <header className="flex flex-col gap-2">
                        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {t('auth.login.benefits.eyebrow')}
                        </span>
                        <p className="text-sm text-pretty text-muted-foreground">
                            {t('auth.login.benefits.description')}
                        </p>
                    </header>

                    <div aria-hidden className="h-px bg-border" />

                    <ol className="flex flex-col gap-5">
                        {BENEFIT_KEYS.map((key, index) => (
                            <li key={key} className="flex gap-3">
                                <span
                                    aria-hidden
                                    className="font-mono text-xs text-brand"
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-foreground">
                                        {key === 'savedScenarios'
                                            ? t('dashboard.scenarioList.title')
                                            : t(
                                                  `auth.login.benefits.${key}.title`,
                                              )}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            `auth.login.benefits.${key}.description`,
                                        )}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>

            <div className="rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
                {t('auth.login.benefits.securityNote')}
            </div>
        </div>
    );
}
