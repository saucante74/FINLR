import { useTranslation } from 'react-i18next';

import NumberedCard from '@/features/landing/components/NumberedCard';
import SectionHeading from '@/features/landing/components/SectionHeading';
import { PROBLEM_KEYS } from '@/features/landing/constants';

export default function ProblemsSection() {
    const { t } = useTranslation();

    return (
        <section
            id="why"
            className="mx-auto flex w-full max-w-7xl scroll-mt-24 flex-col gap-10 px-4 py-16 lg:px-8 lg:py-24"
        >
            <SectionHeading
                eyebrow={t('landing.problems.eyebrow')}
                title={t('landing.problems.title')}
                description={t('landing.problems.description')}
            />

            <ul className="grid gap-6 md:grid-cols-2">
                {PROBLEM_KEYS.map((key, index) => (
                    <NumberedCard
                        key={key}
                        position={index + 1}
                        title={t(`landing.problems.items.${key}.title`)}
                        body={t(`landing.problems.items.${key}.body`)}
                        chip={t(`landing.problems.items.${key}.chip`)}
                    />
                ))}
            </ul>
        </section>
    );
}
