import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScenarioList from '@/features/dashboard/components/ScenarioList';
import SimulatorCard from '@/features/dashboard/components/SimulatorCard';
import type { DashboardPageProps } from '@/features/dashboard/types';
import type { AuthenticatedPageProps } from '@/types';

export default function Dashboard({ scenarios }: DashboardPageProps) {
    const { t } = useTranslation();
    const { auth } = usePage<AuthenticatedPageProps>().props;
    const canAccessSingleEnvelopeSimulator = auth.permissions.includes('advanced_calculator');

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('dashboard.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('dashboard.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                        {t('dashboard.title')}
                    </h1>
                    <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                        {t('dashboard.description')}
                    </p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2">
                    <SimulatorCard
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
                        title={t('dashboard.simulators.multiEnvelope.title')}
                        description={t('dashboard.simulators.multiEnvelope.description')}
                        state="comingSoon"
                    />
                </div>

                <ScenarioList scenarios={scenarios} />
            </main>

            <Footer />
        </div>
    );
}
