import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import WrapperChoiceRow from '@/features/single-envelope-simulator/components/WrapperChoiceRow';
import type { ChooseWrapperPageProps } from '@/features/single-envelope-simulator/types';

export default function ChooseWrapper({ sections }: ChooseWrapperPageProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('simulator.chooseWrapper.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-10 lg:px-8 lg:py-16">
                <header className="flex flex-col gap-4">
                    <span className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('simulator.chooseWrapper.eyebrow')}
                    </span>
                    <h1 className="text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
                        {t('simulator.chooseWrapper.title')}
                    </h1>
                    <p className="max-w-md text-base text-pretty text-muted-foreground">
                        {t('simulator.chooseWrapper.description')}
                    </p>
                </header>

                {sections.map(({ jurisdiction, wrappers }) => (
                    <section key={jurisdiction} className="flex flex-col">
                        <h2 className="flex items-baseline gap-3 border-b border-border pb-3">
                            <span className="text-base font-semibold tracking-tight">
                                {t(`simulator.chooseWrapper.jurisdictions.${jurisdiction}`)}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground tabular-nums">
                                {String(wrappers.length).padStart(2, '0')}
                            </span>
                        </h2>

                        <ul className="flex flex-col">
                            {wrappers.map((wrapper) => (
                                <WrapperChoiceRow key={wrapper} jurisdiction={jurisdiction} wrapper={wrapper} />
                            ))}
                        </ul>
                    </section>
                ))}
            </main>

            <Footer />
        </div>
    );
}
