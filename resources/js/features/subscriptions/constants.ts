import type { BillingPeriod } from '@/features/subscriptions/types';

/** Display order of the premium billing periods offered before checkout. */
export const BILLING_PERIODS: readonly BillingPeriod[] = ['monthly', 'yearly'];

export const DEFAULT_BILLING_PERIOD: BillingPeriod = 'monthly';
