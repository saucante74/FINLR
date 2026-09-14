import { Head, usePage } from '@inertiajs/react';
import { Check, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScenarioList from '@/features/dashboard/components/ScenarioList';
import SimulatorCard, { DashboardBadge } from '@/features/dashboard/components/SimulatorCard';
import { SIMULATOR_ICONS } from '@/features/dashboard/constants';
import type { DashboardPageProps } from '@/features/dashboard/types';
import type { AuthenticatedPageProps } from '@/types';

const PROMO_BENEFIT_KEYS = ['unlimitedScenarios', 'multiEnvelopePreview', 'pdfExport'] as const;

// The dashboard always shows exactly these 3 simulators + the generic
// "view all" card below, regardless of how many simulators the catalog
// actually has (see simulators.index for the full, dynamic list). Icons
// come from SIMULATOR_ICONS (features/dashboard/constants.ts), the single
// source of truth shared with the /simulators full list.
interface FixedSimulatorCard {
    key: 'singleEnvelope' | 'analogy' | 'fire';
    routeName: string;
}

const FIXED_SIMULATOR_CARDS: readonly FixedSimulatorCard[] = [
    { key: 'singleEnvelope', routeName: 'simulators.single-envelope.choose' },
    { key: 'analogy', routeName: 'simulators.analogy.show' },
    { key: 'fire', routeName: 'simulators.fire.show' },
];

export default function Dashboard({ scenarios, scenarioTypeFilter }: DashboardPageProps) {
    const { t } = useTranslation();
    const { auth } = usePage<AuthenticatedPageProps>().props;
    // Gates the 3 fixed simulator cards below — same permission, same
    // routes' own `can:advanced_calculator` middleware.
    const canAccessAdvancedCalculator = auth.permissions.includes('advanced_calculator');

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('dashboard.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-3">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/25 bg-brand/8 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-brand" />
                        {t('dashboard.eyebrow')}
                    </span>
                    <h1 className="text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
                        {t('dashboard.greeting', { name: auth.user.name })}
                    </h1>
                    <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                        {t('dashboard.description')}
                    </p>
                </header>

                {/* 3 fixed simulator cards + 1 generic "view all" card: always
                    4 cards regardless of the catalog's real simulator count
                    (see simulators.index for the full, dynamic list). 2
                    columns on medium screens, 4 on large. */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {FIXED_SIMULATOR_CARDS.map(({ key, routeName }) => (
                        <SimulatorCard
                            key={key}
                            icon={SIMULATOR_ICONS[key]}
                            title={t(`dashboard.simulators.${key}.title`)}
                            description={t(`dashboard.simulators.${key}.description`)}
                            state={canAccessAdvancedCalculator ? 'active' : 'locked'}
                            href={canAccessAdvancedCalculator ? route(routeName) : undefined}
                            note={
                                canAccessAdvancedCalculator
                                    ? undefined
                                    : t(`dashboard.simulators.${key}.lockedNote`)
                            }
                        />
                    ))}
                    <SimulatorCard
                        icon={LayoutGrid}
                        title={t('dashboard.simulators.viewAll.title')}
                        description={t('dashboard.simulators.viewAll.description')}
                        state="active"
                        emphasis="secondary"
                        href={route('simulators.index')}
                        ctaLabel={t('dashboard.simulators.viewAll.title')}
                    />
                </div>

                <ScenarioList scenarios={scenarios} activeType={scenarioTypeFilter} />

                <Card className="flex flex-col items-start justify-between gap-6 rounded-2xl border-brand/20 bg-brand/5 p-7 sm:flex-row sm:items-center">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold tracking-tight">{t('dashboard.promo.title')}</h2>
                        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                            {PROMO_BENEFIT_KEYS.map((key) => (
                                <li key={key} className="flex items-center gap-2">
                                    <Check
                                        aria-hidden
                                        className="size-4 shrink-0 text-brand drop-shadow-[0_0_6px_var(--brand)]"
                                    />
                                    {t(`dashboard.promo.benefits.${key}`)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <DashboardBadge>{t('dashboard.simulatorCard.comingSoonBadge')}</DashboardBadge>
                        <Button type="button" variant="brand" size="lg" className="w-fit shrink-0" disabled>
                            {t('dashboard.promo.cta')}
                        </Button>
                    </div>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
