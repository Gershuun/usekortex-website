import styles from './Header.module.css';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const { t } = useTranslation();
  return (
    <header className={styles.header}>
      <a href="/" className={styles.logo}>Kortex</a>
      <nav className={styles.navLinks} aria-label={t('site.primaryNavigation')}>
        <a href="#explore" className={styles.navLink}>{t('site.navLibrary')}</a>
        <a href="#web-tools" className={styles.navLink}>{t('site.navTools')}</a>
        <a href="#future" className={styles.navLink}>{t('site.navFuture')}</a>
      </nav>
      <LanguageSelector />
    </header>
  );
}