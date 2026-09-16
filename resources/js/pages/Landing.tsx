import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import FaqSection from '@/features/landing/components/FaqSection';
import FinalCtaSection from '@/features/landing/components/FinalCtaSection';
import HeroSection from '@/features/landing/components/HeroSection';
import LandingFooter from '@/features/landing/components/LandingFooter';
import LandingHeader from '@/features/landing/components/LandingHeader';
import MethodSection from '@/features/landing/components/MethodSection';
import PricingSection from '@/features/landing/components/PricingSection';
import ProblemsSection from '@/features/landing/components/ProblemsSection';
import SimulatorsSection from '@/features/landing/components/SimulatorsSection';
import SocialProofSection from '@/features/landing/components/SocialProofSection';
import type { LandingPageProps } from '@/features/landing/types';

export default function Landing({ canLogin, canRegister }: LandingPageProps) {
    const { t } = useTranslation();

    return (
        // Smooth anchor scrolling comes from the `html` rule in app.css; each
        // target section carries a scroll-mt matching the sticky header.
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('landing.meta.title')} />

            <LandingHeader canLogin={canLogin} canRegister={canRegister} />

            <main className="flex flex-1 flex-col">
                <HeroSection canRegister={canRegister} />
                <ProblemsSection />
                <SimulatorsSection />
                <MethodSection />
                <SocialProofSection />
                <PricingSection canRegister={canRegister} />
                <FaqSection />
                <FinalCtaSection canRegister={canRegister} />
            </main>

            <LandingFooter />
        </div>
    );
}
