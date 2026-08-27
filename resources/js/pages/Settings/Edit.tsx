import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AccountStateCard from '@/features/user/components/AccountStateCard';
import DeleteUserForm from '@/features/user/components/DeleteUserForm';
import SimulationPreferencesCard from '@/features/user/components/SimulationPreferencesCard';
import UpdatePasswordForm from '@/features/user/components/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/features/user/components/UpdateProfileInformationForm';
import type { AuthenticatedPageProps } from '@/types';

interface EditProps {
    mustVerifyEmail: boolean;
    status?: string | null;
    memberSince: string;
    profileUpdatedAt: string;
    scenariosCount: number;
}

export default function Edit({
    mustVerifyEmail,
    status,
    memberSince,
    profileUpdatedAt,
    scenariosCount,
}: EditProps) {
    const { t } = useTranslation();
    const { auth } = usePage<AuthenticatedPageProps>().props;

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('settings.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('settings.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                        {t('settings.title')}
                    </h1>
                    <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                        {t('settings.description')}
                    </p>
                </header>

                <div className="flex flex-col gap-6 lg:gap-8">
                    {/* Row 1: same grid row, so both cards stretch to an equal height. */}
                    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            profileUpdatedAt={profileUpdatedAt}
                        />

                        <AccountStateCard
                            user={auth.user}
                            plan={auth.plan}
                            memberSince={memberSince}
                            scenariosCount={scenariosCount}
                        />
                    </div>

                    {/*
                        Row 2+: the note starts as the first item on this row, so its
                        static top naturally lines up with Sécurité's top — then it
                        sticks there once scrolled.
                    */}
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
                        <div className="flex flex-col gap-6">
                            <UpdatePasswordForm />

                            <SimulationPreferencesCard />

                            <DeleteUserForm />
                        </div>

                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground lg:sticky lg:top-20">
                            {t('settings.account.dataNotice')}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
