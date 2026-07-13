import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.css';

const languages = [
  ['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['pt', 'Português'], ['de', 'Deutsch'],
  ['tl', 'Tagalog'], ['ar', 'العربية'], ['hi', 'हिन्दी'], ['zh', '中文'], ['ja', '日本語'], ['ko', '한국어'],
] as const;

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const active = languages.find(([code]) => code === i18n.language) ?? languages[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, []);

  const selectLanguage = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      localStorage.setItem('kortex-language', code);
      document.documentElement.lang = code;
      setOpen(false);
    } catch (error) {
      console.error(`Unable to switch Kortex language to ${code}`, error);
    }
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button className={styles.trigger} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={t('site.language')} onClick={() => setOpen((value) => !value)}>
        <span className={styles.icon} aria-hidden="true">🌐</span>
        <span className={styles.label}>{active[1]}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className={styles.menu} role="listbox" aria-label={t('site.language')}>
          {languages.map(([code, label]) => (
            <button key={code} className={`${styles.option} ${i18n.language === code ? styles.active : ''}`} type="button" role="option" aria-selected={i18n.language === code} onClick={() => void selectLanguage(code)}>
              <span>{label}</span>
              {i18n.language === code && <span className={styles.check} aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}