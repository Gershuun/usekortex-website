import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import tl from './locales/tl.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

const language = localStorage.getItem('kortex-language') || navigator.language.split('-')[0] || 'en';
const supportedLanguage = ['en', 'tl', 'es', 'fr', 'pt', 'de', 'ar', 'hi', 'zh', 'ja', 'ko'].includes(language) ? language : 'en';

document.documentElement.lang = supportedLanguage;
document.documentElement.dir = supportedLanguage === 'ar' ? 'rtl' : 'ltr';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en }, tl: { translation: tl }, es: { translation: es }, fr: { translation: fr },
    pt: { translation: pt }, de: { translation: de }, ar: { translation: ar }, hi: { translation: hi },
    zh: { translation: zh }, ja: { translation: ja }, ko: { translation: ko },
  },
  lng: supportedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
