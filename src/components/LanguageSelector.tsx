import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { languages, resolveLanguage, type LanguageCode } from '../data/languages';
import { languageDirection } from '../kortex-i18n';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedLanguage = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const active = languages.find(({ code }) => code === selectedLanguage) ?? languages[0];

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
    const activeIndex = languages.findIndex(({ code }) => code === selectedLanguage);
    optionRefs.current[activeIndex]?.focus();
  }, [open, selectedLanguage]);

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

  const selectLanguage = async (code: LanguageCode) => {
    setOpen(false);
    try {
      await i18n.changeLanguage(code);
      try {
        localStorage.setItem('kortex-language', code);
      } catch {
        // The current session can still change language without persistence.
      }
      document.documentElement.lang = code;
      document.documentElement.dir = languageDirection(code);
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
        <span className={styles.label}>{active.label}</span>
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
              return;
            }
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const currentIndex = optionRefs.current.indexOf(document.activeElement as HTMLButtonElement);
            const lastIndex = languages.length - 1;
            const nextIndex = event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? lastIndex
                : event.key === 'ArrowDown'
                  ? (currentIndex + 1) % languages.length
                  : (currentIndex - 1 + languages.length) % languages.length;
            optionRefs.current[nextIndex]?.focus();
          }}
        >
          {languages.map(({ code, label }, index) => (
            <button
              key={code}
              ref={(element) => { optionRefs.current[index] = element; }}
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
