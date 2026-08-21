import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import ScenarioChart from '@/features/scenarios/components/ScenarioChart';
import type { ScenarioResult } from '@/features/scenarios/types';

const result: ScenarioResult = {
    points: [
        { year: 0, contributions: 1000, gross: 1000, netReal: 1000, netRealAdjusted: 1000 },
        { year: 5, contributions: 13000, gross: 15234.12, netReal: 14567.45, netRealAdjusted: 13890.02 },
        { year: 10, contributions: 25000, gross: 34567.89, netReal: 31234.56, netRealAdjusted: 29000.12 },
    ],
    invested: 25000,
    grossGains: 9567.89,
    finalGross: 34567.89,
    netRealGains: 6234.56,
    finalNetReal: 31234.56,
    finalNetRealAdjusted: 29000.12,
    shortfall: 3333.33,
};

describe('ScenarioChart', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('mounts without error with a realistic multi-point result and renders its legend', () => {
        render(<ScenarioChart result={result} />);

        expect(screen.getByText(i18n.t('scenario.chart.title'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.chart.contributions'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.chart.gross'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.chart.netReal'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.chart.netRealAdjusted'))).toBeInTheDocument();
    });
});
