import { describe, expect, it } from 'vitest';

import {
    FORM_FIELD_CONFIG,
    FORM_SECTIONS,
    groupFieldsForLayout,
} from '@/features/single-envelope-simulator/lib/formFields';

describe('FORM_SECTIONS', () => {
    it('lists every configured field exactly once', () => {
        const listed = FORM_SECTIONS.flatMap((section) => section.fields);

        expect(listed.sort()).toEqual(Object.keys(FORM_FIELD_CONFIG).sort());
        expect(new Set(listed).size).toBe(listed.length);
    });
});

describe('groupFieldsForLayout', () => {
    it('pairs consecutive amount fields into one group', () => {
        expect(groupFieldsForLayout(['initialCapital', 'monthlyContribution', 'years'])).toEqual([
            ['initialCapital', 'monthlyContribution'],
            ['years'],
        ]);
    });

    it('keeps non-amount fields as standalone groups', () => {
        expect(groupFieldsForLayout(['annualRate', 'wrapperFee', 'fundFee'])).toEqual([
            ['annualRate'],
            ['wrapperFee'],
            ['fundFee'],
        ]);
    });

    it('does not merge amount fields separated by another control', () => {
        expect(groupFieldsForLayout(['initialCapital', 'years', 'monthlyContribution'])).toEqual([
            ['initialCapital'],
            ['years'],
            ['monthlyContribution'],
        ]);
    });
});
