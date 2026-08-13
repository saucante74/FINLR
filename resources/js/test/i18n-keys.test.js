import { describe, expect, it } from 'vitest';

import fr from '../../../lang/fr.json';
import en from '../../../lang/en.json';
import itLocale from '../../../lang/it.json';

function flattenKeys(obj, prefix = '') {
    return Object.entries(obj).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return flattenKeys(value, path);
        }
        return [path];
    });
}

describe('i18n translation files', () => {
    const locales = { fr, en, it: itLocale };
    const keySets = Object.fromEntries(
        Object.entries(locales).map(([locale, dict]) => [
            locale,
            new Set(flattenKeys(dict)),
        ]),
    );

    it.each(Object.keys(locales))(
        '%s has no empty translation values',
        (locale) => {
            const flatEntries = (function collect(obj, prefix = '') {
                return Object.entries(obj).flatMap(([key, value]) => {
                    const path = prefix ? `${prefix}.${key}` : key;
                    if (
                        value &&
                        typeof value === 'object' &&
                        !Array.isArray(value)
                    ) {
                        return collect(value, path);
                    }
                    return [[path, value]];
                });
            })(locales[locale]);

            const empty = flatEntries.filter(
                ([, value]) => typeof value !== 'string' || value.trim() === '',
            );

            expect(empty).toEqual([]);
        },
    );

    it.each(['en', 'it'])(
        'has the exact same keys as fr.json (reference locale): %s',
        (locale) => {
            const missing = [...keySets.fr].filter(
                (key) => !keySets[locale].has(key),
            );
            const extra = [...keySets[locale]].filter(
                (key) => !keySets.fr.has(key),
            );

            expect({ missing, extra }).toEqual({ missing: [], extra: [] });
        },
    );
});
