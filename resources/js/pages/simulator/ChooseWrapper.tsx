import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import type { ChooseWrapperPageProps } from '@/features/single-envelope-simulator/types';

export default function ChooseWrapper({ sections }: ChooseWrapperPageProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('simulator.chooseWrapper.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('simulator.chooseWrapper.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                        {t('simulator.chooseWrapper.title')}
                    </h1>
                    <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                        {t('simulator.chooseWrapper.description')}
                    </p>
                </header>

                {sections.map((section) => (
                    <section key={section.jurisdiction} className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold tracking-tight">
                            {t(`simulator.chooseWrapper.jurisdictions.${section.jurisdiction}`)}
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            {section.wrappers.map((wrapper) => (
                                <Link
                                    key={wrapper}
                                    href={route('simulators.single-envelope.show', { jurisdiction: section.jurisdiction, wrapper })}
                                    className="block"
                                >
                                    <Card className="h-full justify-between gap-6 rounded-2xl py-7 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/50">
                                        <CardContent className="flex flex-col gap-4">
                                            <span className="text-lg font-semibold tracking-tight">
                                                {t(`simulator.singleEnvelope.form.wrapperOptions.${wrapper}`)}
                                            </span>
                                            <span className="inline-flex items-center gap-2 text-base font-semibold text-brand [text-shadow:0_0_24px_var(--brand)]">
                                                {t('simulator.chooseWrapper.cta')}
                                                <ArrowRight aria-hidden className="size-5" />
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            <Footer />
        </div>
    );
}
