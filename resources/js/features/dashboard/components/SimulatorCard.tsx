import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type SimulatorCardState = 'active' | 'locked' | 'comingSoon';

interface SimulatorCardProps {
    index: number;
    title: string;
    description: string;
    state: SimulatorCardState;
    href?: string;
    note?: string;
    // Purely decorative — see DecorativeGrowthGlyph below. Opt-in per card
    // instance so it isn't duplicated on every SimulatorCard.
    showDecorativeChart?: boolean;
}

// Ornamental glyph, not a data visualization: fixed, hardcoded bar
// heights (no computed/real figures) forming a smooth ascending
// silhouette, purely for visual flavor next to the card's description —
// same spirit as a logo mark. Never interactive, no axes/labels/values.
const DECORATIVE_BAR_HEIGHTS = [8, 12, 15, 19, 24, 28, 34, 40] as const;

function DecorativeGrowthGlyph() {
    const barWidth = 6;
    const gap = 3;
    const maxHeight = 40;
    const width = DECORATIVE_BAR_HEIGHTS.length * (barWidth + gap) - gap;

    return (
        <svg
            aria-hidden
            width={width}
            height={maxHeight}
            viewBox={`0 0 ${width} ${maxHeight}`}
            className="shrink-0"
        >
            {DECORATIVE_BAR_HEIGHTS.map((barHeight, i) => (
                <rect
                    key={i}
                    x={i * (barWidth + gap)}
                    y={maxHeight - barHeight}
                    width={barWidth}
                    height={barHeight}
                    rx={1.5}
                    fill="var(--brand)"
                    opacity={0.35 + (i / (DECORATIVE_BAR_HEIGHTS.length - 1)) * 0.65}
                />
            ))}
        </svg>
    );
}

// Plain informational badge — never a button (no interactive role, no
// pointer cursor, no disabled state). Shared so the dashboard's promo
// block reuses the exact same "coming soon" styling instead of a second,
// slightly-divergent copy.
export function DashboardBadge({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-muted-foreground/35 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {children}
        </span>
    );
}

export default function SimulatorCard({
    index,
    title,
    description,
    state,
    href,
    note,
    showDecorativeChart,
}: SimulatorCardProps) {
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
                'h-full justify-between gap-6 rounded-2xl py-7',
                state === 'active' &&
                    'transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/50',
                state !== 'active' && 'border-dashed opacity-75',
            )}
        >
            <CardHeader>
                <div className="mb-3.5 flex items-center gap-3">
                    <span
                        className={cn(
                            'inline-flex size-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm',
                            state === 'active'
                                ? 'bg-brand/15 text-brand shadow-[0_0_12px_-2px_var(--brand)]'
                                : 'bg-muted text-muted-foreground',
                        )}
                    >
                        {index}
                    </span>
                    <CardTitle
                        className={cn(
                            'flex w-full items-start justify-between gap-2 text-lg',
                            state !== 'active' && 'text-muted-foreground',
                        )}
                    >
                        <span>{title}</span>
                        {badgeLabel && <DashboardBadge>{badgeLabel}</DashboardBadge>}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="max-w-[40ch] text-sm text-muted-foreground">{description}</p>
                        {note && <p className="text-xs text-muted-foreground">{note}</p>}
                    </div>
                    {showDecorativeChart && <DecorativeGrowthGlyph />}
                </div>
                {state === 'active' && (
                    <span className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-brand [text-shadow:0_0_24px_var(--brand)]">
                        {t('dashboard.simulatorCard.cta')}
                        <ArrowRight aria-hidden className="size-5" />
                    </span>
                )}
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
