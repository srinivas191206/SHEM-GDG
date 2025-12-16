import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Available languages
export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
];

// RTL languages (for future support)
const RTL_LANGUAGES = ['ar', 'ur', 'he'];

// Initialize i18next
i18n
    .use(HttpBackend) // Load translations from JSON files
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // React binding
    .init({
        fallbackLng: 'en',
        supportedLngs: LANGUAGES.map(l => l.code),
        debug: import.meta.env.DEV,

        interpolation: {
            escapeValue: false, // React already escapes
        },

        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'shem-language',
        },

        returnObjects: true,

        react: {
            useSuspense: true,
        },
    });

// Handle RTL direction
i18n.on('languageChanged', (lng) => {
    const dir = RTL_LANGUAGES.includes(lng) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lng;
});

export default i18n;
