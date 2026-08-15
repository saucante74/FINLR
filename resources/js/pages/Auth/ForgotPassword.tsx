import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

interface ForgotPasswordProps {
    status?: string | null;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('auth.forgotPassword.title')} />

            <Navbar canLogin={true} canRegister={true} />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-4 py-12 lg:px-8">
                <header className="flex flex-col items-center gap-2 text-center">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('auth.forgotPassword.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                        {t('auth.forgotPassword.title')}
                    </h1>
                    <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                        {t('auth.forgotPassword.description')}
                    </p>
                </header>

                {status && (
                    <div className="w-full max-w-md rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-center text-sm font-medium text-brand">
                        {status}
                    </div>
                )}

                <ForgotPasswordForm />
            </main>

            <Footer />
        </div>
    );
}
