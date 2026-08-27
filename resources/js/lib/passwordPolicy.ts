/**
 * Mirrors the server-side policy (`PasswordPolicyServiceProvider`: min 8,
 * mixed case, a number, a symbol). Shared by every form that sets or
 * changes a password (registration, settings) so the criteria checked here
 * and their order never drift between forms.
 */

export type PasswordCriterionKey =
    | 'length'
    | 'uppercase'
    | 'lowercase'
    | 'number'
    | 'symbol';

export interface PasswordCriterion {
    key: PasswordCriterionKey;
    met: boolean;
}

const CRITERION_CHECKS: Record<PasswordCriterionKey, (password: string) => boolean> = {
    length: (password) => password.length >= 8,
    uppercase: (password) => /[A-Z]/.test(password),
    lowercase: (password) => /[a-z]/.test(password),
    number: (password) => /[0-9]/.test(password),
    symbol: (password) => /[^A-Za-z0-9]/.test(password),
};

export const PASSWORD_CRITERION_KEYS: readonly PasswordCriterionKey[] = [
    'length',
    'uppercase',
    'lowercase',
    'number',
    'symbol',
];

export function getPasswordCriteria(password: string): PasswordCriterion[] {
    return PASSWORD_CRITERION_KEYS.map((key) => ({
        key,
        met: CRITERION_CHECKS[key](password),
    }));
}

export function meetsPasswordPolicy(password: string): boolean {
    return getPasswordCriteria(password).every((criterion) => criterion.met);
}
