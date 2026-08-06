import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languageDirection, resources, resolveLanguage } from './kortex-i18n';

let savedLanguage: string | null = null;
try {
  savedLanguage = localStorage.getItem('kortex-language');
} catch {
  // Language selection still works when browser storage is unavailable.
}

const supportedLanguage = resolveLanguage(savedLanguage ?? navigator.language);

document.documentElement.lang = supportedLanguage;
document.documentElement.dir = languageDirection(supportedLanguage);

i18n.use(initReactI18next).init({
  resources,
  lng: supportedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
