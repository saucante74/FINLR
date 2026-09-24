import { useTranslation } from 'react-i18next';

import NumberedCard from '@/features/landing/components/NumberedCard';
import SectionHeading from '@/features/landing/components/SectionHeading';
import { SIMULATOR_HIGHLIGHT_KEYS } from '@/features/landing/constants';

export default function SimulatorsSection() {
    const { t } = useTranslation();

    return (
        <section
            id="simulators"
            className="mx-auto flex w-full max-w-7xl scroll-mt-24 flex-col gap-10 px-4 py-16 lg:px-8 lg:py-24"
        >
            <SectionHeading
                eyebrow={t('landing.simulators.eyebrow')}
                title={t('landing.simulators.title')}
                description={t('landing.simulators.description')}
            />

            <ul className="grid gap-6 md:grid-cols-2">
                {SIMULATOR_HIGHLIGHT_KEYS.map((key, index) => (
                    <NumberedCard
                        key={key}
                        position={index + 1}
                        title={t(`landing.simulators.items.${key}.title`)}
                        body={t(`landing.simulators.items.${key}.body`)}
                        chip={t(`landing.simulators.items.${key}.chip`)}
                    />
                ))}
            </ul>
        </section>
    );
}
