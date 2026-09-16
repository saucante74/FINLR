import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import FaqItem from '@/features/landing/components/FaqItem';
import SectionHeading from '@/features/landing/components/SectionHeading';
import { FAQ_KEYS } from '@/features/landing/constants';
import type { FaqKey } from '@/features/landing/types';

export default function FaqSection() {
    const { t } = useTranslation();
    // One panel open at a time, the first one on arrival — as drawn in the mockup.
    const [openKey, setOpenKey] = useState<FaqKey | null>(FAQ_KEYS[0]);

    return (
        <section
            id="faq"
            className="mx-auto flex w-full max-w-4xl scroll-mt-24 flex-col gap-12 px-4 py-16 lg:px-8 lg:py-24"
        >
            <SectionHeading
                eyebrow={t('landing.faq.eyebrow')}
                title={t('landing.faq.title')}
                centered
            />

            <ul className="flex flex-col gap-4">
                {FAQ_KEYS.map((key) => (
                    <FaqItem
                        key={key}
                        id={`faq-${key}`}
                        question={t(`landing.faq.items.${key}.question`)}
                        answer={t(`landing.faq.items.${key}.answer`)}
                        open={openKey === key}
                        onToggle={() => setOpenKey(openKey === key ? null : key)}
                    />
                ))}
            </ul>
        </section>
    );
}
