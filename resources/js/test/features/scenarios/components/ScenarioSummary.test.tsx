import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import ScenarioSummary from '@/features/scenarios/components/ScenarioSummary';
import type { ScenarioResult } from '@/features/scenarios/types';

const result: ScenarioResult = {
    points: [{ year: 0, contributions: 1000, gross: 1000, netReal: 1000, netRealAdjusted: 1000 }],
    invested: 25000,
    grossGains: 9567.89,
    finalGross: 34567.89,
    netRealGains: 6234.56,
    finalNetReal: 31234.56,
    finalNetRealAdjusted: 29000.12,
    shortfall: 3333.33,
};

describe('ScenarioSummary', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the five result KPIs with their labels', () => {
        render(<ScenarioSummary result={result} />);

        expect(screen.getByText(i18n.t('scenario.summary.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.summary.invested'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.summary.finalGross'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.summary.finalNetReal'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.summary.finalNetRealAdjusted'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.summary.shortfall'))).toBeInTheDocument();
    });
});
