import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
    name: string;
    tagline: string;
    /** The amount block: a price for the free plan, a note for premium (see PricingSection). */
    price: ReactNode;
    badge?: string;
    features: string[];
    ctaLabel: string;
    /** Omitted when registration is closed, in which case no call to action is rendered. */
    ctaHref?: string;
    highlighted?: boolean;
}

export default function PricingCard({
    name,
    tagline,
    price,
    badge,
    features,
    ctaLabel,
    ctaHref,
    highlighted = false,
}: PricingCardProps) {
    return (
        <div
            className={cn(
                'relative flex flex-col gap-6 rounded-2xl border bg-card p-6 text-card-foreground lg:p-8',
                highlighted ? 'border-brand/40' : 'border-border',
            )}
        >
            {badge && (
                <span className="absolute -top-3 right-6 rounded-full bg-brand px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-brand-foreground uppercase">
                    {badge}
                </span>
            )}

            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold tracking-tight">{name}</h3>
                <p className="text-sm text-muted-foreground">{tagline}</p>
            </div>

            {price}

            <ul className="flex flex-col gap-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                        {feature}
                    </li>
                ))}
            </ul>

            {ctaHref && (
                <Button
                    asChild
                    variant={highlighted ? 'brand' : 'outline'}
                    size="lg"
                    className="mt-auto w-full"
                >
                    <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
            )}
        </div>
    );
}
