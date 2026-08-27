import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DashboardBadge } from '@/features/dashboard/components/SimulatorCard';
import { cn } from '@/lib/utils';

interface SimulatorChoiceRowProps {
    index: number;
    title: string;
    description: string;
    chips?: string[];
    active: boolean;
    href?: string;
}

export default function SimulatorChoiceRow({
    index,
    title,
    description,
    chips,
    active,
    href,
}: SimulatorChoiceRowProps) {
    const { t } = useTranslation();

    const monogram = (
        <span
            aria-hidden
            className={cn(
                'relative inline-flex size-14 shrink-0 items-center justify-center rounded-xl font-mono text-xs tracking-wide',
                active ? 'bg-brand/12 text-brand' : 'bg-muted text-muted-foreground',
            )}
        >
            {String(index).padStart(2, '0')}
        </span>
    );

    const body = (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className={cn('text-lg font-semibold tracking-tight', !active && 'text-muted-foreground')}>
                {title}
            </span>

            <p className="text-sm text-pretty text-muted-foreground">{description}</p>

            {chips && chips.length > 0 && (
                <ul className="mt-1 flex flex-wrap items-center gap-2">
                    {chips.map((chip) => (
                        <li
                            key={chip}
                            className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground"
                        >
                            {chip}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    if (active && href) {
        return (
            <li className="border-b border-border/70">
                <Link
                    href={href}
                    className="group flex w-full items-start gap-5 rounded-xl px-2 py-6 transition-colors duration-200 hover:bg-muted/40"
                >
                    {monogram}
                    {body}
                    <span className="inline-flex shrink-0 items-center gap-2 self-center text-sm font-semibold text-brand [text-shadow:0_0_24px_var(--brand)]">
                        {t('simulator.chooseWrapper.cta')}
                        <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                        />
                    </span>
                </Link>
            </li>
        );
    }

    return (
        <li className="border-b border-border/70">
            <div className="flex w-full items-start gap-5 px-2 py-6 opacity-75">
                {monogram}
                {body}
                <span className="shrink-0 self-center">
                    <DashboardBadge>{t('dashboard.simulatorCard.comingSoonBadge')}</DashboardBadge>
                </span>
            </div>
        </li>
    );
}
