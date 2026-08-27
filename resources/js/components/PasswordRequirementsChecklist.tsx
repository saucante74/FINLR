import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { getPasswordCriteria } from '@/lib/passwordPolicy';

interface PasswordRequirementsChecklistProps {
    password: string;
}

export default function PasswordRequirementsChecklist({
    password,
}: PasswordRequirementsChecklistProps) {
    const { t } = useTranslation();
    const criteria = getPasswordCriteria(password);

    return (
        <ul
            aria-label={t('passwordPolicy.title')}
            className="flex flex-col gap-1.5 text-xs"
        >
            {criteria.map(({ key, met }) => (
                <li key={key} className="flex items-center gap-2">
                    {met ? (
                        <Check
                            aria-hidden
                            className="size-3.5 shrink-0 text-brand"
                        />
                    ) : (
                        <span
                            aria-hidden
                            className="flex size-3.5 shrink-0 items-center justify-center"
                        >
                            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                        </span>
                    )}
                    <span
                        className={cn(
                            met ? 'text-foreground' : 'text-muted-foreground',
                        )}
                    >
                        {t(`passwordPolicy.criteria.${key}`)}
                    </span>
                </li>
            ))}
        </ul>
    );
}
