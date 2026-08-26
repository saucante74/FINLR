import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
    WRAPPER_ACCENT_CLASSES,
    WRAPPER_HIGHLIGHT_KEYS,
} from '@/features/single-envelope-simulator/constants';
import type {
    Jurisdiction,
    TaxWrapper,
} from '@/features/single-envelope-simulator/types';
import { cn } from '@/lib/utils';

interface WrapperChoiceRowProps {
    jurisdiction: Jurisdiction;
    wrapper: TaxWrapper;
}

export default function WrapperChoiceRow({ jurisdiction, wrapper }: WrapperChoiceRowProps) {
    const { t } = useTranslation();
    const copy = `simulator.chooseWrapper.wrappers.${wrapper}`;

    return (
        <li className="border-b border-border/70">
            <Link
                href={route('simulators.single-envelope.show', { jurisdiction, wrapper })}
                className="group flex w-full items-start gap-5 rounded-xl px-2 py-6 transition-colors duration-200 hover:bg-muted/40"
            >
                <span
                    aria-hidden
                    className={cn(
                        'relative inline-flex size-14 shrink-0 items-center justify-center rounded-xl font-mono text-xs tracking-wide',
                        WRAPPER_ACCENT_CLASSES[wrapper],
                    )}
                >
                    {t(`${copy}.code`)}
                    <span className="absolute bottom-2 left-2 size-1 rounded-full bg-current" />
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="text-lg font-semibold tracking-tight">{t(`${copy}.name`)}</span>

                    <p className="text-sm text-pretty text-muted-foreground">{t(`${copy}.description`)}</p>

                    <ul className="mt-1 flex flex-wrap items-center gap-2">
                        {WRAPPER_HIGHLIGHT_KEYS.map((highlight) => (
                            <li
                                key={highlight}
                                className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground"
                            >
                                {t(`${copy}.highlights.${highlight}`)}
                            </li>
                        ))}
                    </ul>
                </div>

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
