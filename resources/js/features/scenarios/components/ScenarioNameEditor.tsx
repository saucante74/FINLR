import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScenarioNameEditorProps {
    id: number;
    name: string | null;
}

export default function ScenarioNameEditor({ id, name }: ScenarioNameEditorProps) {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        name: name ?? '',
    });

    const startEditing = () => {
        setData('name', name ?? '');
        setIsEditing(true);
    };

    const cancelEditing = () => {
        reset('name');
        clearErrors('name');
        setIsEditing(false);
    };

    const submit = (e: SubmitEvent) => {
        e.preventDefault();

        patch(route('scenarios.rename', id), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    if (isEditing) {
        return (
            <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="flex flex-col gap-1">
                    <Input
                        id="scenario-name"
                        name="name"
                        type="text"
                        maxLength={255}
                        autoFocus
                        value={data.name}
                        placeholder={t('scenario.title')}
                        aria-invalid={Boolean(errors.name)}
                        aria-label={t('scenario.rename.label')}
                        onChange={(e) => setData('name', e.target.value)}
                        className="h-auto py-1 text-2xl font-semibold tracking-tight lg:text-3xl"
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="flex gap-2">
                    <Button type="submit" variant="brand" size="sm" disabled={processing}>
                        {t('scenario.rename.save')}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                        {t('scenario.rename.cancel')}
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
                {name ?? t('scenario.title')}
            </h1>
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t('scenario.rename.button')}
                onClick={startEditing}
            >
                <Pencil className="size-4" />
            </Button>
        </div>
    );
}
