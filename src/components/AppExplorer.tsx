import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { kortexApps, type AppCategory, type KortexApp } from '../data/apps';
import { useToast } from './useToast';
import styles from './AppExplorer.module.css';

type CategoryFilter = 'all' | AppCategory;

const categoryKeys: Record<CategoryFilter, string> = {
  all: 'site.categories.all',
  organize: 'site.categories.organize',
  create: 'site.categories.create',
  explore: 'site.categories.explore',
};

function AppPreview({ app }: { app: KortexApp }) {
  if (app.id === 'contacts') {
    return (
      <div className={`${styles.preview} ${styles.contactsPreview}`} aria-hidden="true">
        <div className={styles.previewTop}><span>12:04</span><span className={styles.liveDot}>LOCAL</span></div>
        {['JM', 'AS', 'BK'].map((initials, index) => (
          <div className={styles.contactRow} key={initials}>
            <span className={styles.avatar}>{initials}</span>
            <span className={styles.contactLines}><i /><i /></span>
            <span className={styles.fixChip}>{index === 1 ? 'Merge' : 'Fix'}</span>
          </div>
        ))}
      </div>
    );
  }

  if (app.id === 'captions') {
    return (
      <div className={`${styles.preview} ${styles.captionsPreview}`} aria-hidden="true">
        <div className={styles.photoSky}><span className={styles.sun} /><span className={styles.hill} /></div>
        <div className={styles.captionLines}><i /><i /><i /></div>
        <div className={styles.magicBar}><span>{'\u2726'}</span><span>Generate</span><span>{'\u2192'}</span></div>
      </div>
    );
  }

  if (app.id === 'filters') {
    return (
      <div className={`${styles.preview} ${styles.filtersPreview}`} aria-hidden="true">
        <div className={styles.beforeAfter}><span className={styles.beforeLabel}>Before</span><span className={styles.afterLabel}>After</span><i /></div>
        <div className={styles.filterRail}>{['4K', 'Glow', 'Film', 'Fix'].map((label) => <span key={label}>{label}</span>)}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.preview} ${styles.trailsPreview}`} aria-hidden="true">
      <div className={styles.mapGrid} />
      <span className={`${styles.trailLine} ${styles.trailOne}`} />
      <span className={`${styles.trailLine} ${styles.trailTwo}`} />
      <span className={`${styles.mapPin} ${styles.pinOne}`}>1</span>
      <span className={`${styles.mapPin} ${styles.pinTwo}`}>2</span>
      <div className={styles.trailInfo}><span>TRAIL ATLAS</span><strong>8 nearby</strong></div>
    </div>
  );
}

export function AppExplorer() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [activeId, setActiveId] = useState<KortexApp['id']>('filters');
  const activeApp = kortexApps.find((app) => app.id === activeId) ?? kortexApps[0];
  const visibleApps = useMemo(
    () => category === 'all' ? kortexApps : kortexApps.filter((app) => app.category === category),
    [category],
  );

  const selectCategory = (nextCategory: CategoryFilter) => {
    setCategory(nextCategory);
    const firstMatch = nextCategory === 'all' ? kortexApps[0] : kortexApps.find((app) => app.category === nextCategory);
    if (firstMatch) setActiveId(firstMatch.id);
  };

  return (
    <section className={styles.section} id="explore">
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>{t('site.explorerEyebrow')}</span>
          <h2>{t('site.explorerTitle')}</h2>
        </div>
        <p>{t('site.explorerSubtitle')}</p>
      </div>

      <div className={styles.filters} aria-label={t('site.filterApps')}>
        {(Object.keys(categoryKeys) as CategoryFilter[]).map((key) => (
          <button key={key} className={category === key ? styles.filterActive : ''} type="button" onClick={() => selectCategory(key)}>
            {t(categoryKeys[key])}
          </button>
        ))}
      </div>

      <div className={styles.explorerLayout}>
        <div className={styles.appGrid} id="apps">
          {visibleApps.map((app, index) => (
            <button
              key={app.id}
              type="button"
              className={`${styles.appCard} ${activeId === app.id ? styles.appCardActive : ''}`}
              style={{ '--accent': app.accent, '--accent-rgb': app.accentRgb, '--delay': `${index * 70}ms` } as React.CSSProperties}
              onClick={() => setActiveId(app.id)}
              aria-pressed={activeId === app.id}
            >
              <span className={styles.cardGlow} />
              <span className={styles.cardTop}>
                <img src={app.icon} alt="" className={styles.appIcon} />
                <span className={styles.status}><i />{t(app.statusKey)}</span>
              </span>
              <span className={styles.cardBody}>
                <strong>{app.name}</strong>
                <span>{t(app.taglineKey)}</span>
              </span>
              <span className={styles.cardFooter}>
                <span>{activeId === app.id ? t('site.selected') : t('site.peekInside')}</span>
                <span className={styles.arrow}>{'\u2197'}</span>
              </span>
            </button>
          ))}
        </div>

        <article
          className={styles.spotlight}
          style={{ '--accent': activeApp.accent, '--accent-rgb': activeApp.accentRgb } as React.CSSProperties}
          aria-live="polite"
        >
          <span className={styles.spotlightGlow} />
          <div className={styles.spotlightTop}>
            <div className={styles.spotlightIdentity}>
              <img src={activeApp.icon} alt="" className={styles.spotlightIcon} />
              <div><span>{t(activeApp.statusKey)}</span><h3>{activeApp.name}</h3></div>
            </div>
            <span className={styles.appNumber}>{String(kortexApps.findIndex((app) => app.id === activeApp.id) + 1).padStart(2, '0')}</span>
          </div>
          <AppPreview app={activeApp} />
          <div className={styles.spotlightCopy}>
            <span className={styles.tagline}>{t(activeApp.taglineKey)}</span>
            <p>{t(activeApp.descriptionKey)}</p>
            <div className={styles.featurePills}>
              {activeApp.featureKeys.map((key) => <span key={key}>{t(key)}</span>)}
            </div>
          </div>
          <div className={styles.spotlightActions}>
            <button type="button" onClick={() => showToast(t('site.toastFollow', { app: activeApp.name }))}>{t('site.followApp')}</button>
            <a href="#future">{t('site.discoverMore')}<span>{'\u2192'}</span></a>
          </div>
        </article>
      </div>

      <div className={styles.future} id="future">
        <div className={styles.futureCopy}>
          <span className={styles.eyebrow}>{t('site.futureEyebrow')}</span>
          <h2>{t('site.futureTitle')}</h2>
          <p>{t('site.futureBody')}</p>
        </div>
        <div className={styles.constellation} aria-hidden="true">
          {kortexApps.map((app, index) => <img key={app.id} src={app.icon} alt="" style={{ '--i': index } as React.CSSProperties} />)}
          <span>+46</span>
        </div>
        <div className={styles.futureBadge}><span>{'\u2726'}</span>{t('site.futureBadge')}</div>
      </div>
    </section>
  );
}
