import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import SingleEnvelopeForm from '@/features/single-envelope-simulator/components/SingleEnvelopeForm';
import type { SingleEnvelopeSimulatorPageProps } from '@/features/single-envelope-simulator/types';

export default function SingleEnvelopeSimulator({ defaults }: SingleEnvelopeSimulatorPageProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('simulator.singleEnvelope.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('simulator.singleEnvelope.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                        {t('simulator.singleEnvelope.title')}
                    </h1>
                </header>

                <Card>
                    <CardContent>
                        <SingleEnvelopeForm defaults={defaults} />
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
