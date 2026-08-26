import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ApplicationLogo from '@/components/ApplicationLogo';

describe('ApplicationLogo', () => {
    it('shows the light logo by default and hides it in dark mode', () => {
        const { container } = render(<ApplicationLogo />);
        const img = container.querySelector(
            'img[src="/images/logo-light.png"]',
        );

        expect(img).not.toBeNull();
        expect(img?.className.split(' ')).toContain('block');
        expect(img?.className).toContain('dark:hidden');
    });

    it('hides the dark logo by default and shows it in dark mode', () => {
        const { container } = render(<ApplicationLogo />);
        const img = container.querySelector(
            'img[src="/images/logo-dark.png"]',
        );

        expect(img).not.toBeNull();
        expect(img?.className).toContain('hidden');
        expect(img?.className).toContain('dark:block');
    });
});
