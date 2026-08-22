import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-border">
            <div className="mx-auto max-w-7xl px-4 py-6 text-center font-mono text-xs text-muted-foreground lg:px-8">
                {t('footer.copyright', { year: new Date().getFullYear() })}
            </div>
        </footer>
    );
}
