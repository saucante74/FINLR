import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AuthenticatedPageProps } from '@/types';

interface UpdateProfileInformationProps {
    mustVerifyEmail: boolean;
    status?: string | null;
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: UpdateProfileInformationProps) {
    const { t } = useTranslation();
    const user = usePage<AuthenticatedPageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <Card className="gap-0 py-0">
            <CardHeader className="border-b border-border py-5">
                <CardTitle className="text-base">
                    {t('profile.information.title')}
                </CardTitle>
                <CardDescription>
                    {t('profile.information.description')}
                </CardDescription>
            </CardHeader>

            <CardContent className="py-6">
                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">
                            {t('profile.information.name')}
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            aria-invalid={Boolean(errors.name)}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">
                            {t('profile.information.email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <p>
                                {t('profile.information.unverified')}{' '}
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="font-medium text-brand hover:underline"
                                >
                                    {t('profile.information.resendLink')}
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <p className="font-medium text-brand">
                                    {t('profile.information.verificationSent')}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            variant="brand"
                            disabled={processing}
                        >
                            {t('profile.information.save')}
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-muted-foreground">
                                {t('profile.information.saved')}
                            </p>
                        </Transition>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
