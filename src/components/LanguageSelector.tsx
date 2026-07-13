import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.css';

const languages = [
  ['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['pt', 'Português'], ['de', 'Deutsch'],
  ['tl', 'Tagalog'], ['ar', 'العربية'], ['hi', 'हिन्दी'], ['zh', '中文'], ['ja', '日本語'], ['ko', '한국어'],
] as const;

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">🌐</span>
      <select
        className={styles.select}
        value={i18n.language}
        aria-label={t('site.language')}
        onChange={async (event) => {
          const code = event.target.value;
          try {
            await i18n.changeLanguage(code);
            localStorage.setItem('kortex-language', code);
            document.documentElement.lang = code;
          } catch (error) {
            console.error(`Unable to switch Kortex language to ${code}`, error);
          }
        }}
      >
        {languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
      </select>
    </div>
  );
}