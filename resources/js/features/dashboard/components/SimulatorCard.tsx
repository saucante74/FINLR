import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type SimulatorCardState = 'active' | 'locked' | 'comingSoon';

interface SimulatorCardProps {
    title: string;
    description: string;
    state: SimulatorCardState;
    href?: string;
    note?: string;
}

export default function SimulatorCard({ title, description, state, href, note }: SimulatorCardProps) {
    const { t } = useTranslation();

    const badgeLabel =
        state === 'locked'
            ? t('dashboard.simulatorCard.lockedBadge')
            : state === 'comingSoon'
              ? t('dashboard.simulatorCard.comingSoonBadge')
              : null;

    const card = (
        <Card
            className={cn(
                'h-full transition-colors',
                state === 'active' && 'hover:border-brand/50',
                state !== 'active' && 'opacity-75',
            )}
        >
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    <span>{title}</span>
                    {badgeLabel && (
                        <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {badgeLabel}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">{description}</p>
                {note && <p className="text-xs text-muted-foreground">{note}</p>}
            </CardContent>
        </Card>
    );

    if (state === 'active' && href) {
        return (
            <Link href={href} className="block">
                {card}
            </Link>
        );
    }

    return card;
}
