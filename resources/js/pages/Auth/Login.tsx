import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import LoginBenefits from '@/features/auth/components/LoginBenefits';
import LoginForm from '@/features/auth/components/LoginForm';

interface LoginProps {
    status?: string | null;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('auth.login.title')} />

            <Navbar canLogin={false} canRegister={true} />

            <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-12 lg:px-8">
                {status && (
                    <div className="w-full rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-center text-sm font-medium text-brand">
                        {status}
                    </div>
                )}

                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <LoginForm canResetPassword={canResetPassword} />
                    <LoginBenefits />
                </div>
            </main>

            <Footer />
        </div>
    );
}
