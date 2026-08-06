import ar from './locales/ar.json';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import pt from './locales/pt.json';
import tl from './locales/tl.json';
import zh from './locales/zh.json';

const catalogs = { ar, de, en, es, fr, hi, ja, ko, pt, tl, zh } as const;

export const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', direction: 'ltr' },
  { code: 'tl', name: 'Tagalog', direction: 'ltr' },
  { code: 'es', name: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'Français', direction: 'ltr' },
  { code: 'pt', name: 'Português', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', direction: 'ltr' },
  { code: 'ar', name: 'العربية', direction: 'rtl' },
  { code: 'hi', name: 'हिन्दी', direction: 'ltr' },
  { code: 'zh', name: '中文', direction: 'ltr' },
  { code: 'ja', name: '日本語', direction: 'ltr' },
  { code: 'ko', name: '한국어', direction: 'ltr' },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]['code'];
export type LanguageDirection = (typeof LANGUAGE_OPTIONS)[number]['direction'];
export type TranslationVariables = Readonly<Record<string, string | number | boolean | undefined>>;
export type TranslationKey = string;

export const SUPPORTED_LANGUAGES = LANGUAGE_OPTIONS;
export const SUPPORTED_LANGUAGE_CODES: readonly LanguageCode[] = LANGUAGE_OPTIONS.map(({ code }) => code);
export const resources = {
  ar: { translation: ar },
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  hi: { translation: hi },
  ja: { translation: ja },
  ko: { translation: ko },
  pt: { translation: pt },
  tl: { translation: tl },
  zh: { translation: zh },
} as const;

const languageCodes = new Set<string>(LANGUAGE_OPTIONS.map(({ code }) => code));

export function isLanguageCode(value: string): value is LanguageCode {
  return languageCodes.has(value);
}

export function resolveLanguage(value: string | null | undefined): LanguageCode {
  const normalized = String(value ?? '').trim().toLowerCase().replace(/_/g, '-');
  const base = normalized.split('-')[0] ?? '';
  return isLanguageCode(base) ? base : 'en';
}

export function languageName(value: string): string {
  return LANGUAGE_OPTIONS.find(({ code }) => code === resolveLanguage(value))?.name ?? 'English';
}

export function languageDirection(value: string): LanguageDirection {
  return LANGUAGE_OPTIONS.find(({ code }) => code === resolveLanguage(value))?.direction ?? 'ltr';
}

export type TranslationCatalog = typeof en;

export function getCatalog(language: string): TranslationCatalog {
  return catalogs[resolveLanguage(language)] as TranslationCatalog;
}

export function localeForLanguage(language: string): string {
  const locales: Record<LanguageCode, string> = {
    ar: 'ar',
    de: 'de-DE',
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    hi: 'hi-IN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    pt: 'pt-BR',
    tl: 'fil-PH',
    zh: 'zh-CN',
  };
  return locales[resolveLanguage(language)];
}

function lookup(catalog: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((value, part) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
    return (value as Record<string, unknown>)[part];
  }, catalog);
}

function interpolate(template: string, variables: TranslationVariables): string {
  return template.replace(/{{\s*([^},\s]+)[^}]*}}|(?<!\{)\{\s*([A-Za-z_][\w.-]*)\s*\}(?!\})/g, (match, doubleName: string, singleName: string) => {
    const name = doubleName ?? singleName;
    return Object.prototype.hasOwnProperty.call(variables, name) && variables[name] !== undefined
      ? String(variables[name])
      : match;
  });
}

export function hasTranslation(language: string, key: TranslationKey): boolean {
  const selected = lookup(catalogs[resolveLanguage(language)], key);
  return typeof selected === 'string' || typeof lookup(en, key) === 'string';
}

export function translate(language: string, key: TranslationKey, variables: TranslationVariables = {}): string {
  const selected = lookup(catalogs[resolveLanguage(language)], key);
  const fallback = lookup(en, key);
  const template = typeof selected === 'string' ? selected : typeof fallback === 'string' ? fallback : key;
  return interpolate(template, variables);
}

export function createTranslator(language: string) {
  const resolved = resolveLanguage(language);
  return (key: TranslationKey, variables?: TranslationVariables) => translate(resolved, key, variables);
}
