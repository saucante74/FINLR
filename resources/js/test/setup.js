import '@testing-library/jest-dom/vitest';
import '@/i18n';

if (!window.matchMedia) {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    });
}

global.route = (name, params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return `/${name}${query}`;
};

if (!global.ResizeObserver) {
    global.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
