import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { kortexApps } from '../data/apps';
import type { KortexApp } from '../data/apps';
import styles from './Hero.module.css';

interface HeroProps {
  onSelectApp: (id: KortexApp['id']) => void;
}

export function Hero({ onSelectApp }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <div className={styles.badge}><span /> {t('site.heroEyebrow')}</div>
        <h1 className={styles.title}>{t('site.heroTitle')}</h1>
        <p className={styles.tagline}>{t('site.heroTagline')}</p>
        <div className={styles.actions}>
          <a href="#explore" className={styles.primaryAction}>{t('site.exploreCta')}<span>{'\u2193'}</span></a>
          <a href="#future" className={styles.secondaryAction}>{t('site.futureCta')}<span>{'\u2197'}</span></a>
        </div>
        <div className={styles.promise}><span>{'\u2726'}</span><p>{t('site.heroPromise')}</p></div>
      </div>

      <div className={styles.universe} aria-label={t('site.appUniverse')}>
        <span className={styles.orbitOne} />
        <span className={styles.orbitTwo} />
        <div className={styles.core}><span>K</span><small>{t('site.appsCount', { count: kortexApps.length })}</small></div>
        {kortexApps.map((app, index) => (
          <a
            key={app.id}
            href="#apps"
            className={styles.orbitApp}
            style={{ '--index': index, '--accent': app.accent, '--accent-rgb': app.accentRgb } as CSSProperties}
            aria-label={app.name}
            onClick={(event) => {
              event.preventDefault();
              onSelectApp(app.id);
              document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <img src={app.icon} alt="" />
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
        <span>{t('site.play')}</span><i />
        <span>{t('site.categories.organize')}</span><i />
        <span>{t('site.categories.create')}</span>
      </div>
    </section>
  );
}