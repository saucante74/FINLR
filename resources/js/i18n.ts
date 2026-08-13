import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import fr from '../../lang/fr.json';
import en from '../../lang/en.json';
import it from '../../lang/it.json';

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            fr: { translation: fr },
            en: { translation: en },
            it: { translation: it },
        },
        fallbackLng: 'fr',
        supportedLngs: ['fr', 'en', 'it'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'finlr_locale',
        },
    });

export default i18next;
