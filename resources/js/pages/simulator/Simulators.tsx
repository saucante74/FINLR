import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SimulatorChoiceRow from '@/features/simulator-choice/components/SimulatorChoiceRow';

interface SimulatorChoice {
    key: 'singleEnvelope' | 'multiEnvelope' | 'analogy';
    active: boolean;
    href?: string;
    chips?: string[];
}

export default function Simulators() {
    const { t } = useTranslation();

    const choices: SimulatorChoice[] = [
        {
            key: 'singleEnvelope',
            active: true,
            href: route('simulators.single-envelope.choose'),
            chips: [
                t('simulator.chooseWrapper.wrappers.pea.code'),
                t('simulator.chooseWrapper.wrappers.cto.code'),
            ],
        },
        {
            key: 'multiEnvelope',
            active: true,
            href: route('simulators.multi-envelope.show'),
        },
        {
            key: 'analogy',
            active: true,
            href: route('simulators.analogy.show'),
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('simulator.index.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-10 lg:px-8 lg:py-16">
                <header className="flex flex-col gap-4">
                    <span className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('simulator.index.eyebrow')}
                    </span>
                    <h1 className="text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
                        {t('simulator.index.title')}
                    </h1>
                    <p className="max-w-md text-base text-pretty text-muted-foreground">
                        {t('simulator.index.description')}
                    </p>
                </header>

                <section className="flex flex-col">
                    <ul className="flex flex-col">
                        {choices.map((choice, index) => (
                            <SimulatorChoiceRow
                                key={choice.key}
                                index={index + 1}
                                title={t(`dashboard.simulators.${choice.key}.title`)}
                                description={t(`dashboard.simulators.${choice.key}.description`)}
                                chips={choice.chips}
                                active={choice.active}
                                href={choice.href}
                            />
                        ))}
                    </ul>
                </section>
            </main>

            <Footer />
        </div>
    );
}
