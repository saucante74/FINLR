import { Link, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VerifyEmailForm() {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit = (e: SubmitEvent) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <Card className="w-full max-w-md gap-0 py-0">
            <CardContent className="flex flex-col gap-5 py-6">
                <form
                    onSubmit={submit}
                    className="flex items-center justify-between gap-4"
                >
                    <Button type="submit" variant="brand" disabled={processing}>
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
    );
}
