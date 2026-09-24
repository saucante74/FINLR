interface NumberedCardProps {
    /** 1-based position, rendered as the mockup's monospaced "01", "02", "03". */
    position: number;
    title: string;
    body: string;
    chip: string;
}

/**
 * The card shared by the "problems" and "simulators" sections: same numbered
 * header, same body, same monospaced chip, same gradient hairline on top.
 */
export default function NumberedCard({ position, title, body, chip }: NumberedCardProps) {
    return (
        <li className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground">
            {/* The mockup's hairline: brand green on the left, fading out to the
                right. Built from the brand token, no literal colour. */}
            <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand to-transparent"
            />

            <span className="font-mono text-xs tracking-[0.2em] text-brand">
                {String(position).padStart(2, '0')}
            </span>

            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

            <p className="text-sm text-pretty text-muted-foreground">{body}</p>

            <span className="mt-auto w-fit rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">
                {chip}
            </span>
        </li>
    );
}
