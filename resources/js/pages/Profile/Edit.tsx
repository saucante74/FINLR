import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import DeleteUserForm from '@/features/user/components/DeleteUserForm';
import UpdatePasswordForm from '@/features/user/components/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/features/user/components/UpdateProfileInformationForm';

interface EditProps {
    mustVerifyEmail: boolean;
    status?: string | null;
}

export default function Edit({ mustVerifyEmail, status }: EditProps) {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('profile.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('profile.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                        {t('profile.title')}
                    </h1>
                    <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                        {t('profile.description')}
                    </p>
                </header>

                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />

                <UpdatePasswordForm />

                <DeleteUserForm />

                <div className="flex justify-end border-t border-border pt-6">
                    <Button asChild variant="ghost">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                        >
                            {t('nav.logout')}
                        </Link>
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
