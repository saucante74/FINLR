import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScenarioChart from '@/features/scenarios/components/ScenarioChart';
import ScenarioDetails from '@/features/scenarios/components/ScenarioDetails';
import ScenarioSummary from '@/features/scenarios/components/ScenarioSummary';
import { formatDate } from '@/features/scenarios/lib/format';
import type { ScenarioProps } from '@/features/scenarios/types';

export default function ScenarioShow({ input, result, createdAt }: ScenarioProps) {
    const { t, i18n } = useTranslation();

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
                    <p className="text-sm text-muted-foreground">
                        {t('scenario.createdAtLabel', { date: formatDate(createdAt, i18n.resolvedLanguage) })}
                    </p>
                </header>

                <ScenarioSummary result={result} />
                <ScenarioChart result={result} />
                <ScenarioDetails input={input} />
            </main>

            <Footer />
        </div>
    );
}
