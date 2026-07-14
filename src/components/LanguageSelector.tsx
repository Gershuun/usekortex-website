import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.css';

const languages = [
  ['en', 'English'], ['es', 'Espa\u00f1ol'], ['fr', 'Fran\u00e7ais'], ['pt', 'Portugu\u00eas'], ['de', 'Deutsch'],
  ['tl', 'Tagalog'], ['ar', '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'], ['hi', '\u0939\u093f\u0928\u094d\u0926\u0940'], ['zh', '\u4e2d\u6587'], ['ja', '\u65e5\u672c\u8a9e'], ['ko', '\ud55c\uad6d\uc5b4'],
] as const;

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const active = languages.find(([code]) => code === selectedLanguage) ?? languages[0];

  useLayoutEffect(() => {
    if (!open) return;

    const positionMenu = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPosition({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    };

    positionMenu();
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, true);
    return () => {
      window.removeEventListener('resize', positionMenu);
      window.removeEventListener('scroll', positionMenu, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [open]);

  const selectLanguage = async (code: string) => {
    setSelectedLanguage(code);
    setOpen(false);
    try {
      await i18n.changeLanguage(code);
      localStorage.setItem('kortex-language', code);
      document.documentElement.lang = code;
      document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
      triggerRef.current?.focus();
    } catch (error) {
      console.error(`Unable to switch Kortex language to ${code}`, error);
    }
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('site.language')}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
          if (event.key === 'Escape') setOpen(false);
        }}
      >
        <span className={styles.icon} aria-hidden="true">{'\u{1F310}'}</span>
        <span className={styles.label}>{active[1]}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true" />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          className={styles.menu}
          style={{ top: menuPosition.top, right: menuPosition.right }}
          role="listbox"
          aria-label={t('site.language')}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          {languages.map(([code, label]) => (
            <button
              key={code}
              className={`${styles.option} ${selectedLanguage === code ? styles.active : ''}`}
              type="button"
              role="option"
              aria-selected={selectedLanguage === code}
              onClick={() => void selectLanguage(code)}
            >
              <span>{label}</span>
              {selectedLanguage === code && <span className={styles.check} aria-hidden="true">{'\u2713'}</span>}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}