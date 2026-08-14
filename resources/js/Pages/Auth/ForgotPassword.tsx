import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordProps {
    status?: string | null;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('password.email'));
    };

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

                <Card className="w-full max-w-md gap-0 py-0">
                    <CardContent className="flex flex-col gap-5 py-6">
                        <form onSubmit={submit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">
                                    {t('auth.forgotPassword.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    aria-invalid={Boolean(errors.email)}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="brand"
                                className="w-full"
                                disabled={processing}
                            >
                                {t('auth.forgotPassword.submit')}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground">
                            <Link
                                href={route('login')}
                                className="font-medium text-brand hover:underline"
                            >
                                {t('auth.forgotPassword.backToLogin')}
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
