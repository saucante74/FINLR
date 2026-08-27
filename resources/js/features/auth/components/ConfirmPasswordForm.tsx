import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function ConfirmPasswordForm() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e: SubmitEvent) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <Card className="w-full max-w-md gap-0 py-0">
            <CardContent className="flex flex-col gap-5 py-6">
                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">
                            {t('auth.confirmPassword.password')}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                autoFocus
                                aria-invalid={Boolean(errors.password)}
                                className="pr-10"
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={
                                    showPassword
                                        ? t('auth.confirmPassword.hidePassword')
                                        : t('auth.confirmPassword.showPassword')
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

                    <Button
                        type="submit"
                        variant="brand"
                        className="w-full"
                        disabled={processing}
                    >
                        {t('auth.confirmPassword.submit')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
