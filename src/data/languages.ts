import {
  LANGUAGE_OPTIONS,
  resolveLanguage as resolveSharedLanguage,
  type LanguageCode,
} from '../kortex-i18n';

export const languages = LANGUAGE_OPTIONS.map(({ code, name }) => ({
  code,
  label: name,
}));

export type { LanguageCode };

export const defaultLanguage: LanguageCode = 'en';

export function resolveLanguage(value?: string | null): LanguageCode {
  return resolveSharedLanguage(value);
}

