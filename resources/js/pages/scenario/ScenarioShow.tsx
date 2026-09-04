import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import type { AnalogyScenarioResult } from '@/features/analogy-simulator/types';
import type { FireScenarioResult } from '@/features/fire-simulator/types';
import type { MultiEnvelopeScenarioResult } from '@/features/multi-envelope-simulator/types';
import AnalogyScenarioSummary from '@/features/scenarios/components/AnalogyScenarioSummary';
import FireScenarioSummary from '@/features/scenarios/components/FireScenarioSummary';
import MultiEnvelopeScenarioSummary from '@/features/scenarios/components/MultiEnvelopeScenarioSummary';
import ScenarioChart from '@/features/scenarios/components/ScenarioChart';
import ScenarioDetails from '@/features/scenarios/components/ScenarioDetails';
import ScenarioNameEditor from '@/features/scenarios/components/ScenarioNameEditor';
import ScenarioSummary from '@/features/scenarios/components/ScenarioSummary';
import { formatDate } from '@/features/scenarios/lib/format';
import type { ScenarioProps, ScenarioResult } from '@/features/scenarios/types';

export default function ScenarioShow({ id, input, result, calculatorType, createdAt, name }: ScenarioProps) {
    const { t, i18n } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={name ?? t('scenario.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('scenario.eyebrow')}
                    </span>
                    <ScenarioNameEditor id={id} name={name} />
                    <p className="text-sm text-muted-foreground">
                        {t('scenario.createdAtLabel', { date: formatDate(createdAt, i18n.resolvedLanguage) })}
                    </p>
                </header>

                {calculatorType === 'multi_envelope' && (
                    <MultiEnvelopeScenarioSummary result={result as MultiEnvelopeScenarioResult} />
                )}
                {calculatorType === 'analogy' && (
                    <AnalogyScenarioSummary result={result as AnalogyScenarioResult} />
                )}
                {calculatorType === 'fire' && (
                    <FireScenarioSummary result={result as FireScenarioResult} />
                )}
                {calculatorType === 'single_envelope' && (
                    <>
                        <ScenarioSummary result={result as ScenarioResult} />
                        <ScenarioChart result={result as ScenarioResult} />
                        <ScenarioDetails input={input} />
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
