import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

import SliderField from '@/components/form/SliderField';

describe('SliderField', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the label, numeric value and percent unit', () => {
        render(
            <SliderField
                fieldKey="annualReturnRate"
                label="Rendement annuel"
                helpText="Rendement brut annuel"
                value={6}
                unit="percent"
                step={0.1}
                min={0}
                max={15}
                onChange={vi.fn()}
            />,
        );

        expect(screen.getByLabelText('Rendement annuel')).toHaveValue(6);
        expect(screen.getByText(i18n.t('form.percentUnit'))).toBeInTheDocument();
    });

    it('shows the error message instead of the help text when given', () => {
        render(
            <SliderField
                fieldKey="annualReturnRate"
                label="Rendement annuel"
                helpText="Rendement brut annuel"
                value={6}
                unit="percent"
                step={0.1}
                min={0}
                max={15}
                error="Doit être compris entre 0 et 15."
                onChange={vi.fn()}
            />,
        );

        expect(screen.getByText('Doit être compris entre 0 et 15.')).toBeInTheDocument();
        expect(screen.queryByText('Rendement brut annuel')).not.toBeInTheDocument();
    });

    it('renders the years unit for a duration field', () => {
        render(
            <SliderField
                fieldKey="durationYears"
                label="Durée"
                helpText="Horizon"
                value={15}
                unit="years"
                step={1}
                min={1}
                max={40}
                onChange={vi.fn()}
            />,
        );

        expect(screen.getByText(i18n.t('form.yearsUnit', { count: 15 }))).toBeInTheDocument();
    });
});
