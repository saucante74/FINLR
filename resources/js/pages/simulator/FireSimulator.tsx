import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import FireForm from '@/features/fire-simulator/components/FireForm';
import type { FireSimulatorPageProps } from '@/features/fire-simulator/types';

export default function FireSimulator({ defaults }: FireSimulatorPageProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('simulator.fire.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('simulator.fire.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                        {t('simulator.fire.title')}
                    </h1>
                    <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                        {t('simulator.fire.description')}
                    </p>
                </header>

                <FireForm defaults={defaults} />
            </main>

            <Footer />
        </div>
    );
}
