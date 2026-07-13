import styles from './Header.module.css';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
    const { t } = useTranslation();
    return (
        <header className={styles.header}>
            <a href="/" className={styles.logo}>Kortex</a>
            <nav className={styles.navLinks}>
                <a href="#contacts-anchor" className={styles.navLink}>{t('site.contacts')}</a>
                <a href="#captions-anchor" className={styles.navLink}>{t('site.captions')}</a>
            </nav>
            <LanguageSelector />
        </header>
    );
}
