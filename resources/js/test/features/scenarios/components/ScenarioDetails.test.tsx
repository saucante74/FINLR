import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';

import ScenarioDetails from '@/features/scenarios/components/ScenarioDetails';
import type { ScenarioInput } from '@/features/scenarios/types';

const input: ScenarioInput = {
    initialCapital: 1000,
    monthlyContribution: 200,
    annualRate: 5.5,
    years: 10,
    wrapperFee: 0.6,
    fundFee: 0.3,
    taxRate: 12.8,
    inflationRate: 2,
    inflationEnabled: true,
    wrapper: 'pea',
};

describe('ScenarioDetails', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the ten input parameters read-only', () => {
        render(<ScenarioDetails input={input} />);

        expect(screen.getByText(i18n.t('scenario.details.title'))).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
        expect(screen.getByText('200')).toBeInTheDocument();
        expect(screen.getByText('5.5%')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.details.inflationYes'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('scenario.details.wrapperOptions.pea'))).toBeInTheDocument();

        // Read-only: no input, checkbox or select control should be rendered.
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
});
