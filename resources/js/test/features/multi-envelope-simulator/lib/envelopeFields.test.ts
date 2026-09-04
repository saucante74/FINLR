import { describe, expect, it } from 'vitest';

import { ENVELOPE_FIELD_CONFIG, ENVELOPE_FIELD_ORDER } from '@/features/multi-envelope-simulator/lib/envelopeFields';

describe('ENVELOPE_FIELD_ORDER', () => {
    it('lists every configured field exactly once', () => {
        expect(ENVELOPE_FIELD_ORDER.slice().sort()).toEqual(Object.keys(ENVELOPE_FIELD_CONFIG).sort());
        expect(new Set(ENVELOPE_FIELD_ORDER).size).toBe(ENVELOPE_FIELD_ORDER.length);
    });
});
