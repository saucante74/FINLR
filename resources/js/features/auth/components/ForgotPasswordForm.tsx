import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordForm() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
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
    );
}
