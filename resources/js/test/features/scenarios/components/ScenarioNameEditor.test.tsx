import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import ScenarioNameEditor from '@/features/scenarios/components/ScenarioNameEditor';

describe('ScenarioNameEditor', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('shows the generic title as a fallback when there is no name', () => {
        render(<ScenarioNameEditor id={42} name={null} />);

        expect(screen.getByRole('heading', { name: i18n.t('scenario.title') })).toBeInTheDocument();
    });

    it('shows the scenario name when set', () => {
        render(<ScenarioNameEditor id={42} name="Retraite à 62 ans" />);

        expect(screen.getByRole('heading', { name: 'Retraite à 62 ans' })).toBeInTheDocument();
    });

    it('reveals an editable field prefilled with the current name when clicking rename', async () => {
        const user = userEvent.setup();
        render(<ScenarioNameEditor id={42} name="Retraite à 62 ans" />);

        await user.click(screen.getByRole('button', { name: i18n.t('scenario.rename.button') }));

        expect(screen.getByLabelText(i18n.t('scenario.rename.label'))).toHaveValue('Retraite à 62 ans');
        expect(screen.getByRole('button', { name: i18n.t('scenario.rename.save') })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: i18n.t('scenario.rename.cancel') })).toBeInTheDocument();
    });

    it('returns to display mode without submitting when cancel is clicked', async () => {
        const user = userEvent.setup();
        render(<ScenarioNameEditor id={42} name="Retraite à 62 ans" />);

        await user.click(screen.getByRole('button', { name: i18n.t('scenario.rename.button') }));
        await user.click(screen.getByRole('button', { name: i18n.t('scenario.rename.cancel') }));

        expect(screen.getByRole('heading', { name: 'Retraite à 62 ans' })).toBeInTheDocument();
        expect(screen.queryByLabelText(i18n.t('scenario.rename.label'))).not.toBeInTheDocument();
    });

    it('submits the new name and returns to display mode on success', async () => {
        const user = userEvent.setup();
        render(<ScenarioNameEditor id={42} name={null} />);

        await user.click(screen.getByRole('button', { name: i18n.t('scenario.rename.button') }));
        await user.type(screen.getByLabelText(i18n.t('scenario.rename.label')), 'Nouveau nom');
        await user.click(screen.getByRole('button', { name: i18n.t('scenario.rename.save') }));

        expect(screen.queryByLabelText(i18n.t('scenario.rename.label'))).not.toBeInTheDocument();
    });
});
