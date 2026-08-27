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

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                    <div className="flex flex-1 flex-col gap-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            profileUpdatedAt={profileUpdatedAt}
                        />

                        <UpdatePasswordForm />

                        <SimulationPreferencesCard />

                        <DeleteUserForm />
                    </div>

                    {/*
                        Both cards live inside a single sticky wrapper rather than
                        each being sticky on its own: stacked as normal siblings,
                        they can never overlap regardless of either card's height,
                        and they scroll together as one unit all the way down the
                        (much taller) left column.
                    */}
                    <div className="flex flex-1 flex-col gap-4 lg:sticky lg:top-20">
                        <AccountStateCard
                            user={auth.user}
                            plan={auth.plan}
                            memberSince={memberSince}
                            scenariosCount={scenariosCount}
                        />

                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs text-muted-foreground">
                            {t('settings.account.dataNotice')}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
