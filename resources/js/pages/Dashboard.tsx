import { Head, Link, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScenarioList from '@/features/dashboard/components/ScenarioList';
import SimulatorCard, { DashboardBadge } from '@/features/dashboard/components/SimulatorCard';
import type { DashboardPageProps } from '@/features/dashboard/types';
import type { AuthenticatedPageProps } from '@/types';

const PROMO_BENEFIT_KEYS = ['unlimitedScenarios', 'multiEnvelopePreview', 'pdfExport'] as const;

export default function Dashboard({ scenarios }: DashboardPageProps) {
    const { t } = useTranslation();
    const { auth } = usePage<AuthenticatedPageProps>().props;
    const canAccessSingleEnvelopeSimulator = auth.permissions.includes('advanced_calculator');

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('dashboard.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-col gap-3">
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
                    </div>
                    <Button asChild variant="brand" size="lg" className="w-fit shrink-0">
                        <Link href={route('simulators.single-envelope.show')}>
                            {t('dashboard.newSimulation')}
                        </Link>
                    </Button>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                    <SimulatorCard
                        index={1}
                        title={t('dashboard.simulators.singleEnvelope.title')}
                        description={t('dashboard.simulators.singleEnvelope.description')}
                        state={canAccessSingleEnvelopeSimulator ? 'active' : 'locked'}
                        href={
                            canAccessSingleEnvelopeSimulator
                                ? route('simulators.single-envelope.show')
                                : undefined
                        }
                        note={
                            canAccessSingleEnvelopeSimulator
                                ? undefined
                                : t('dashboard.simulators.singleEnvelope.lockedNote')
                        }
                    />
                    <SimulatorCard
                        index={2}
                        title={t('dashboard.simulators.multiEnvelope.title')}
                        description={t('dashboard.simulators.multiEnvelope.description')}
                        state="comingSoon"
                    />
                </div>

                <ScenarioList scenarios={scenarios} />

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
                        <Button type="button" variant="brand" disabled>
                            {t('dashboard.promo.cta')}
                        </Button>
                    </div>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
