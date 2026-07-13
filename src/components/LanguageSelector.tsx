import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.css';

const languages = [
  ['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['pt', 'Português'], ['de', 'Deutsch'],
  ['tl', 'Tagalog'], ['ar', 'العربية'], ['hi', 'हिन्दी'], ['zh', '中文'], ['ja', '日本語'], ['ko', '한국어'],
] as const;

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const active = languages.find(([code]) => code === i18n.language) || languages[0];

  return (
    <div className={styles.wrapper}>
      <button className={styles.trigger} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={t('site.language')}>
        <span aria-hidden="true">◎</span> {active[1]}
      </button>
      {open && (
        <>
          <button className={styles.backdrop} type="button" aria-label="Close language menu" onClick={() => setOpen(false)} />
          <div className={styles.menu} role="menu">
            {languages.map(([code, label]) => (
              <button key={code} className={`${styles.option} ${i18n.language === code ? styles.active : ''}`} type="button" role="menuitem" onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                try {
                  await i18n.changeLanguage(code);
                  localStorage.setItem('kortex-language', code);
                  document.documentElement.lang = code;
                  setOpen(false);
                } catch (error) {
                  console.error(`Unable to switch Kortex language to ${code}`, error);
                }
              }}>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
