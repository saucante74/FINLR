import { describe, expect, it } from 'vitest';

import { FIELD_CONFIG, FIELD_ORDER } from '@/features/fire-simulator/lib/fields';

describe('FIELD_ORDER', () => {
    it('lists every configured field exactly once', () => {
        expect(FIELD_ORDER.slice().sort()).toEqual(Object.keys(FIELD_CONFIG).sort());
        expect(new Set(FIELD_ORDER).size).toBe(FIELD_ORDER.length);
    });

    it('places currentCapital before currentAge', () => {
        expect(FIELD_ORDER.indexOf('currentCapital')).toBeLessThan(FIELD_ORDER.indexOf('currentAge'));
    });
});
