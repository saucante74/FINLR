import { cn } from '@/lib/utils';

interface SectionHeadingProps {
    eyebrow: string;
    title: string;
    /** Intro paragraph shown beside the title on large screens, below it on mobile. */
    description?: string;
    /** Centers the block, as the pricing, FAQ and social-proof sections do in the mockup. */
    centered?: boolean;
}

export default function SectionHeading({
    eyebrow,
    title,
    description,
    centered = false,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-6',
                centered && 'items-center text-center',
                // Two columns only when there is an intro to sit beside the
                // title; on its own the title spans the section, as it does in
                // the mockup's "method" section.
                !centered && description && 'lg:grid lg:grid-cols-2 lg:items-end lg:gap-12',
            )}
        >
            <div className="flex flex-col gap-4">
                <span className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
                    {eyebrow}
                </span>
                <h2 className="text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
                    {title}
                </h2>
            </div>

            {description && (
                <p className="max-w-xl text-base text-pretty text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}
