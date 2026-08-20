import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';

interface ScenarioShowProps {
    scenarioId: number;
}

export default function ScenarioShow({ scenarioId }: ScenarioShowProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('scenario.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('scenario.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                        {t('scenario.title')}
                    </h1>
                </header>

                <Card>
                    <CardContent>
                        <p>
                            {t('scenario.idLabel')}: {scenarioId}
                        </p>
                        <p className="text-sm text-muted-foreground">{t('scenario.comingSoon')}</p>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
