import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import MultiEnvelopeScenarioSummary from '@/features/scenarios/components/MultiEnvelopeScenarioSummary';
import type { MultiEnvelopeScenarioResult } from '@/features/multi-envelope-simulator/types';

const result: MultiEnvelopeScenarioResult = {
    summary: { year: 10, totalDeposited: 25000, netBalance: 26627.78, realNetBalanceWithInflation: 24000.55 },
    pockets: [
        { accountType: 'PEA', totalDeposited: 15000, netBalance: 16000, taxRegime: 'SOCIAL_LEVIES_ONLY' },
        { accountType: 'CTO', totalDeposited: 10000, netBalance: 10627.78, taxRegime: 'FLAT_TAX' },
    ],
};

describe('MultiEnvelopeScenarioSummary', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the headline figures', () => {
        render(<MultiEnvelopeScenarioSummary result={result} />);

        expect(screen.getByText(i18n.t('scenario.multiEnvelope.summaryTitle'))).toBeInTheDocument();
        expect(screen.getByText('26 628 €')).toBeInTheDocument();
        expect(screen.getByText('24 001 €')).toBeInTheDocument();
        expect(screen.getByText('25 000 €')).toBeInTheDocument();
    });

    it('renders one line per pocket, labelled by account type', () => {
        render(<MultiEnvelopeScenarioSummary result={result} />);

        expect(screen.getByText(i18n.t('simulator.multiEnvelope.accountTypes.PEA'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('simulator.multiEnvelope.accountTypes.CTO'))).toBeInTheDocument();
        expect(screen.getByText('16 000 €')).toBeInTheDocument();
        expect(screen.getByText('10 628 €')).toBeInTheDocument();
    });
});
