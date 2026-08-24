import type { TaxWrapper } from '@/features/single-envelope-simulator/types';

/**
 * Per-wrapper accent used by the choice page's monogram tile. Kept here
 * rather than inline in the component so the palette stays one list, and
 * spelled as whole class strings so Tailwind's scanner sees them.
 */
export const WRAPPER_ACCENT_CLASSES: Record<TaxWrapper, string> = {
    pea: 'bg-brand/12 text-brand',
    cto: 'bg-sky-500/12 text-sky-700 dark:text-sky-400',
};

/** Highlight chips shown under each wrapper description, in display order. */
export const WRAPPER_HIGHLIGHT_KEYS = ['primary', 'secondary'] as const;
