import type { ImgHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

type ApplicationLogoProps = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'alt'
>;

export default function ApplicationLogo({
    className,
    ...props
}: ApplicationLogoProps) {
    const { t } = useTranslation();
    const alt = t('nav.brand');

    return (
        <span className="inline-flex">
            <img
                src="/images/logo-light.png"
                alt={alt}
                className={cn('block dark:hidden', className)}
                {...props}
            />
            <img
                src="/images/logo-dark.png"
                alt={alt}
                className={cn('hidden dark:block', className)}
                {...props}
            />
        </span>
    );
}
