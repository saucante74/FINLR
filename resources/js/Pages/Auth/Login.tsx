import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LoginProps {
    status?: string | null;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={t('auth.login.title')} />

            <Navbar canLogin={false} canRegister={true} />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-4 py-12 lg:px-8">
                <header className="flex flex-col items-center gap-2 text-center">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('auth.login.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                        {t('auth.login.title')}
                    </h1>
                    <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                        {t('auth.login.description')}
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
                                    {t('auth.login.email')}
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

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Label htmlFor="password">
                                        {t('auth.login.password')}
                                    </Label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                        >
                                            {t('auth.login.forgotPassword')}
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        aria-invalid={Boolean(
                                            errors.password,
                                        )}
                                        className="pr-10"
                                        onChange={(e) =>
                                            setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        aria-label={
                                            showPassword
                                                ? t('auth.login.hidePassword')
                                                : t('auth.login.showPassword')
                                        }
                                        className={cn(
                                            'absolute inset-y-0 right-0 flex items-center px-3',
                                            'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Checkbox
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData('remember', checked === true)
                                    }
                                />
                                {t('auth.login.rememberMe')}
                            </label>

                            <Button
                                type="submit"
                                variant="brand"
                                className="w-full"
                                disabled={processing}
                            >
                                {t('auth.login.submit')}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground">
                            {t('auth.login.noAccount')}{' '}
                            <Link
                                href={route('register')}
                                className="font-medium text-brand hover:underline"
                            >
                                {t('auth.login.registerLink')}
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
