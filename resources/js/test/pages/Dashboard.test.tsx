import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';

vi.mock('@inertiajs/react');

import Dashboard from '@/pages/Dashboard';

describe('Dashboard page', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('fr');
    });

    it('renders the dashboard title and welcome message', () => {
        render(<Dashboard />);

        expect(
            screen.getByText(i18n.t('dashboard.title')),
        ).toBeInTheDocument();
        expect(
            screen.getByText(i18n.t('dashboard.welcomeMessage')),
        ).toBeInTheDocument();
    });
});
