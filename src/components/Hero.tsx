import styles from './Hero.module.css';
import { useTranslation } from 'react-i18next';

export function Hero() {
    const { t } = useTranslation();
    return (
        <div className={styles.hero}>
            <div className={styles.badge}>
                <span></span> {t('site.badge')}
            </div>
            <h1 className={styles.title}>{t('site.heroTitle')}</h1>
            <p className={styles.tagline}>{t('site.heroTagline')}</p>
        </div>
    );
}
