import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CalculatorForm from '@/Components/calculator/CalculatorForm';
import GrowthChart from '@/Components/calculator/GrowthChart';
import KpiCards from '@/Components/calculator/KpiCards';
import Navbar from '@/Components/Navbar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { computeCompound } from '@/lib/compound';

export default function Calculator({ canLogin, canRegister, financial }) {
    const { t } = useTranslation();
    const [inputs, setInputs] = useState(financial.defaults);

    const result = useMemo(() => computeCompound(inputs), [inputs]);

    const handleChange = (patch) =>
        setInputs((prev) => ({ ...prev, ...patch }));

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Head title={t('hero.title')} />

            <Navbar canLogin={canLogin} canRegister={canRegister} />

            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('hero.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                        {t('hero.title')}
                    </h1>
                    <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                        {t('hero.description')}
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-stretch">
                    <CalculatorForm
                        inputs={inputs}
                        onChange={handleChange}
                        taxSuggestions={financial.taxSuggestions}
                    />

                    <div className="flex flex-col gap-6">
                        <KpiCards result={result} />

                        <Card className="gap-0 py-0">
                            <CardHeader className="border-b border-border py-5">
                                <CardTitle className="text-base">
                                    {t('chart.title', { count: inputs.years })}
                                </CardTitle>
                                <CardDescription>
                                    {t('chart.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="py-6">
                                <GrowthChart result={result} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
