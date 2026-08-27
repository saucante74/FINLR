import { Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';

import PasswordRequirementsChecklist from '@/components/PasswordRequirementsChecklist';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function RegisterForm() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: SubmitEvent) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <Card className="w-full max-w-md gap-0 py-0">
            <CardContent className="flex flex-col gap-6 py-6">
                <header className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-brand uppercase">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t('auth.register.eyebrow')}
                    </span>
                    <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                        {t('auth.register.title')}
                    </h1>
                    <p className="text-sm text-pretty text-muted-foreground">
                        {t('auth.register.description')}
                    </p>
                </header>

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">
                            {t('auth.register.name')}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            autoComplete="name"
                            autoFocus
                            aria-invalid={Boolean(errors.name)}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            required
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">
                            {t('auth.register.email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            aria-invalid={Boolean(errors.email)}
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                            required
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">
                            {t('auth.register.password')}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.password)}
                                className="pr-10"
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={
                                    showPassword
                                        ? t('auth.register.hidePassword')
                                        : t('auth.register.showPassword')
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
                        <PasswordRequirementsChecklist
                            password={data.password}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password_confirmation">
                            {t('auth.register.passwordConfirmation')}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={
                                    showPasswordConfirmation
                                        ? 'text'
                                        : 'password'
                                }
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                aria-invalid={Boolean(
                                    errors.password_confirmation,
                                )}
                                className="pr-10"
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswordConfirmation((v) => !v)
                                }
                                aria-label={
                                    showPasswordConfirmation
                                        ? t('auth.register.hidePassword')
                                        : t('auth.register.showPassword')
                                }
                                className={cn(
                                    'absolute inset-y-0 right-0 flex items-center px-3',
                                    'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {showPasswordConfirmation ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-xs text-destructive">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="brand"
                        size="lg"
                        className="w-full"
                        disabled={processing}
                    >
                        {t('auth.register.submit')}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    {t('auth.register.alreadyRegistered')}{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-brand hover:underline"
                    >
                        {t('auth.register.loginLink')}
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
