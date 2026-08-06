import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { heroOrbitApps, kortexApps, type KortexAppId } from '../data/apps';
import { webTools } from '../data/webTools';
import { ProductIcon } from './ProductIcon';
import styles from './Hero.module.css';

interface HeroProps {
  onSelectApp: (id: KortexAppId) => void;
}

export function Hero({ onSelectApp }: HeroProps) {
  const { t } = useTranslation();
  const totalProducts = kortexApps.length + webTools.length;

  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <div className={styles.badge}>
          <span />
          {t('site.libraryEyebrow', { apps: kortexApps.length, tools: webTools.length })}
        </div>
        <h1 className={styles.title}>{t('site.heroTitle')}</h1>
        <p className={styles.tagline}>{t('site.libraryHeroTagline')}</p>
        <div className={styles.actions}>
          <a href="#explore" className={styles.primaryAction}>{t('site.exploreCta')}<span>{'\u2193'}</span></a>
          <a href="#web-tools" className={styles.secondaryAction}>{t('site.browseToolsCta')}<span>{'\u2197'}</span></a>
        </div>
        <div className={styles.promise}><span>{'\u2726'}</span><p>{t('site.heroPromise')}</p></div>
      </div>

      <div className={styles.universe} aria-label={t('site.appUniverse')}>
        <span className={styles.orbitOne} />
        <span className={styles.orbitTwo} />
        <div className={styles.core}>
          <span>K</span>
          <small>{t('site.libraryCountShort', { count: totalProducts })}</small>
        </div>
        {heroOrbitApps.map((app) => (
          <a
            key={app.id}
            href="#explore"
            className={styles.orbitApp}
            style={{ '--accent': app.accent, '--accent-rgb': app.accentRgb } as CSSProperties}
            aria-label={app.name}
            onClick={(event) => {
              event.preventDefault();
              onSelectApp(app.id);
              document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <ProductIcon app={app} className={styles.orbitIcon} />
            <span>{app.name.replace('Kortex ', '')}</span>
          </a>
        ))}
        <span className={`${styles.spark} ${styles.sparkOne}`}>{'\u2726'}</span>
        <span className={`${styles.spark} ${styles.sparkTwo}`}>{'\u00b7'}</span>
        <span className={`${styles.spark} ${styles.sparkThree}`}>{'\u2726'}</span>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <span>{t('site.categories.organize')}</span><i />
        <span>{t('site.categories.create')}</span><i />
        <span>{t('site.categories.explore')}</span><i />
        <span>{t('site.categories.work')}</span><i />
        <span>{t('site.categories.games')}</span><i />
        <span>{t('site.libraryInstantTools')}</span>
      </div>
    </section>
  );
}