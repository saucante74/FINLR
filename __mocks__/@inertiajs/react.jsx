import React from 'react';
import { vi } from 'vitest';

export function Head({ children }) {
    return children ?? null;
}

export function Link({ href, children, ...props }) {
    return (
        <a href={href} {...props}>
            {children}
        </a>
    );
}

export function useForm(initialValues) {
    const [data, setDataState] = React.useState(initialValues);
    const [processing] = React.useState(false);
    const [errors] = React.useState({});

    const setData = (key, value) => {
        if (typeof key === 'object' && key !== null) {
            setDataState((prev) => ({ ...prev, ...key }));
        } else {
            setDataState((prev) => ({ ...prev, [key]: value }));
        }
    };

    const post = vi.fn((_url, options) => {
        options?.onFinish?.();
    });

    return {
        data,
        setData,
        post,
        processing,
        errors,
        reset: vi.fn(),
    };
}

export function usePage() {
    return { props: {} };
}
