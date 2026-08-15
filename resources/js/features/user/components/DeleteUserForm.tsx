import { useForm } from '@inertiajs/react';
import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeleteUserForm() {
    const { t } = useTranslation();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e: FormEvent) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <Card className="gap-0 py-0">
            <CardHeader className="border-b border-border py-5">
                <CardTitle className="text-base">
                    {t('profile.deleteAccount.title')}
                </CardTitle>
                <CardDescription>
                    {t('profile.deleteAccount.description')}
                </CardDescription>
            </CardHeader>

            <CardContent className="py-6">
                <Button variant="destructive" onClick={confirmUserDeletion}>
                    {t('profile.deleteAccount.button')}
                </Button>

                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={deleteUser} className="flex flex-col gap-4 p-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            {t('profile.deleteAccount.confirmTitle')}
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            {t('profile.deleteAccount.confirmDescription')}
                        </p>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password" className="sr-only">
                                {t('profile.deleteAccount.password')}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder={t(
                                    'profile.deleteAccount.password',
                                )}
                                autoFocus
                                aria-invalid={Boolean(errors.password)}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal}
                            >
                                {t('profile.deleteAccount.cancel')}
                            </Button>

                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                {t('profile.deleteAccount.confirm')}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </CardContent>
        </Card>
    );
}
