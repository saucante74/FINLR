import { describe, expect, it } from 'vitest';

import { SHARED_FIELD_CONFIG, SHARED_FIELD_ORDER } from '@/features/analogy-simulator/lib/sharedFields';

describe('SHARED_FIELD_ORDER', () => {
    it('lists every configured field exactly once', () => {
        expect(SHARED_FIELD_ORDER.slice().sort()).toEqual(Object.keys(SHARED_FIELD_CONFIG).sort());
        expect(new Set(SHARED_FIELD_ORDER).size).toBe(SHARED_FIELD_ORDER.length);
    });
});
