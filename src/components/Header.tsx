import styles from './Header.module.css';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const { t } = useTranslation();
  return (
    <header className={styles.header}>
      <a href="/" className={styles.logo}>Kortex</a>
      <nav className={styles.navLinks}>
        <a href="#explore" className={styles.navLink}>{t('site.navExplore')}</a>
        <a href="#apps" className={styles.navLink}>{t('site.navApps')}</a>
        <a href="#future" className={styles.navLink}>{t('site.navFuture')}</a>
      </nav>
      <LanguageSelector />
    </header>
  );
}