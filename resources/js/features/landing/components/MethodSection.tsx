import { useTranslation } from 'react-i18next';

import SectionHeading from '@/features/landing/components/SectionHeading';
import { METHOD_STEP_KEYS } from '@/features/landing/constants';

export default function MethodSection() {
    const { t } = useTranslation();

    return (
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 lg:px-8 lg:py-24">
            <SectionHeading
                eyebrow={t('landing.method.eyebrow')}
                title={t('landing.method.title')}
            />

            <ol className="grid gap-10 md:grid-cols-3">
                {METHOD_STEP_KEYS.map((key, index) => (
                    <li key={key} className="flex flex-col gap-4">
                        <span className="flex size-10 items-center justify-center rounded-full border border-brand/25 bg-brand/8 font-mono text-sm text-brand">
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        <h3 className="text-lg font-semibold tracking-tight">
                            {t(`landing.method.steps.${key}.title`)}
                        </h3>

                        <p className="text-sm text-pretty text-muted-foreground">
                            {t(`landing.method.steps.${key}.body`)}
                        </p>
                    </li>
                ))}
            </ol>
        </section>
    );
}
