import styles from './Footer.module.css';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div>&copy; 2026 Kortex. {t('site.rights')}</div>
      <div className={styles.footerNav}>
        <a href="/privacy/" className={styles.footerLink}>{t('site.privacy')}</a>
        <a href="/terms/" className={styles.footerLink}>{t('site.terms')}</a>
        <a href="/support/" className={styles.footerLink}>{t('site.support')}</a>
      </div>
    </footer>
  );
}