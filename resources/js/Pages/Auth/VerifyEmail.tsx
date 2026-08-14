import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VerifyEmailProps {
    status?: string | null;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('auth.verifyEmail.title')} />

            <Navbar />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-4 py-12 lg:px-8">
                <header className="flex flex-col items-center gap-2 text-center">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('auth.verifyEmail.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                        {t('auth.verifyEmail.title')}
                    </h1>
                    <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                        {t('auth.verifyEmail.description')}
                    </p>
                </header>

                {status === 'verification-link-sent' && (
                    <div className="w-full max-w-md rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-center text-sm font-medium text-brand">
                        {t('auth.verifyEmail.statusSent')}
                    </div>
                )}

                <Card className="w-full max-w-md gap-0 py-0">
                    <CardContent className="flex flex-col gap-5 py-6">
                        <form
                            onSubmit={submit}
                            className="flex items-center justify-between gap-4"
                        >
                            <Button
                                type="submit"
                                variant="brand"
                                disabled={processing}
                            >
                                {t('auth.verifyEmail.resend')}
                            </Button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                                {t('auth.verifyEmail.logout')}
                            </Link>
                        </form>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
