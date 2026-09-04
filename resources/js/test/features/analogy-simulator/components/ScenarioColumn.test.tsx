import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

import ScenarioColumn from '@/features/analogy-simulator/components/ScenarioColumn';
import type { AccountType } from '@/features/analogy-simulator/types';

const accountTypes: AccountType[] = ['PEA', 'PEA_PME', 'CTO', 'ASSURANCE_VIE', 'CAT', 'LIVRET_A', 'LDDS', 'COMPTE_COURANT'];

describe('ScenarioColumn', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the side label, current account type and label field', () => {
        render(
            <ScenarioColumn
                side="A"
                accountTypes={accountTypes}
                accountType="PEA"
                label=""
                onAccountTypeChange={vi.fn()}
                onLabelChange={vi.fn()}
            />,
        );

        expect(screen.getByText(i18n.t('simulator.analogy.form.scenarioA'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('simulator.analogy.accountTypes.PEA'))).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(i18n.t('simulator.analogy.defaultLabelA')),
        ).toBeInTheDocument();
    });

    it('shows the label field error instead of the help text when given', () => {
        render(
            <ScenarioColumn
                side="B"
                accountTypes={accountTypes}
                accountType="CTO"
                label=""
                labelError="Trop long."
                onAccountTypeChange={vi.fn()}
                onLabelChange={vi.fn()}
            />,
        );

        expect(screen.getByText('Trop long.')).toBeInTheDocument();
        expect(screen.queryByText(i18n.t('simulator.analogy.form.labelHelpText'))).not.toBeInTheDocument();
    });

    it('calls onLabelChange when the label field is edited', async () => {
        const user = userEvent.setup();
        const onLabelChange = vi.fn();
        render(
            <ScenarioColumn
                side="A"
                accountTypes={accountTypes}
                accountType="PEA"
                label=""
                onAccountTypeChange={vi.fn()}
                onLabelChange={onLabelChange}
            />,
        );

        await user.type(screen.getByLabelText(i18n.t('simulator.analogy.form.label')), 'a');

        expect(onLabelChange).toHaveBeenCalledWith('a');
    });
});
