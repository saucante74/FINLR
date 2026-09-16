import { Plus, X } from 'lucide-react';

interface FaqItemProps {
    /** Stable id used to wire the button to its answer panel (aria-controls). */
    id: string;
    question: string;
    answer: string;
    open: boolean;
    onToggle: () => void;
}

export default function FaqItem({ id, question, answer, open, onToggle }: FaqItemProps) {
    const panelId = `${id}-answer`;

    return (
        <li className="rounded-xl border border-border bg-card text-card-foreground">
            <h3>
                <button
                    type="button"
                    id={id}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={onToggle}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium"
                >
                    {question}
                    {open ? (
                        <X aria-hidden className="size-4 shrink-0 text-brand" />
                    ) : (
                        <Plus aria-hidden className="size-4 shrink-0 text-brand" />
                    )}
                </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={id} hidden={!open}>
                <p className="px-6 pb-5 text-sm text-pretty text-muted-foreground">
                    {answer}
                </p>
            </div>
        </li>
    );
}
