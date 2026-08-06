import { type CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { appCategories, getKortexApp, kortexApps, type AppCategory, type KortexApp, type KortexAppId } from '../data/apps';
import { webTools } from '../data/webTools';
import styles from './AppExplorer.module.css';
import { FollowAppModal } from './FollowAppModal';
import { ProductIcon } from './ProductIcon';

type CategoryFilter = 'all' | AppCategory;

const categoryFilters = [
  ['all', 'site.categories.all'] as const,
  ...appCategories.map((category) => [category, `site.categories.${category}`] as const),
] satisfies readonly (readonly [CategoryFilter, string])[];

function AppPreview({ app }: { app: KortexApp }) {
  const { t } = useTranslation();

  if (app.preview === 'contacts') {
    return (
      <div className={`${styles.preview} ${styles.contactsPreview}`} aria-hidden="true">
        <div className={styles.previewTop}><span>12:04</span><span className={styles.liveDot}>{t('site.preview.local')}</span></div>
        {['JM', 'AS', 'BK'].map((initials, index) => (
          <div className={styles.contactRow} key={initials}>
            <span className={styles.avatar}>{initials}</span>
            <span className={styles.contactLines}><i /><i /></span>
            <span className={styles.fixChip}>{t(index === 1 ? 'site.preview.merge' : 'site.preview.fix')}</span>
          </div>
        ))}
      </div>
    );
  }

  if (app.preview === 'captions') {
    return (
        <div className={`${styles.preview} ${styles.captionsPreview}`} aria-hidden="true">
        <div className={styles.photoSky}><span className={styles.sun} /><span className={styles.hill} /></div>
        <div className={styles.captionLines}><i /><i /><i /></div>
        <div className={styles.magicBar}><span>{'\u2726'}</span><span>{t('site.preview.generate')}</span><span>{'\u2192'}</span></div>
      </div>
    );
  }

  if (app.preview === 'filters') {
    return (
      <div className={`${styles.preview} ${styles.filtersPreview}`} aria-hidden="true">
        <div className={styles.beforeAfter}><span className={styles.beforeLabel}>{t('site.preview.before')}</span><span className={styles.afterLabel}>{t('site.preview.after')}</span><i /></div>
        <div className={styles.filterRail}>{['filter4k', 'glow', 'film', 'fix'].map((labelKey) => <span key={labelKey}>{t(`site.preview.${labelKey}`)}</span>)}</div>
      </div>
    );
  }

  if (app.preview === 'bowl') {
    return (
      <div className={`${styles.preview} ${styles.bowlPreview}`} aria-hidden="true">
        <div className={styles.laneGlow} />
        <div className={styles.pinDeck}>{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</div>
        <span className={styles.bowlingBall} />
        <div className={styles.scoreStrip}><span>{t('site.preview.frame', { number: 10 })}</span><strong>247</strong></div>
      </div>
    );
  }

  if (app.preview === 'numbers') {
    return (
      <div className={`${styles.preview} ${styles.numbersPreview}`} aria-hidden="true">
        <div className={styles.numberGrid}>
          {[8, 2, 5, 5, 1, 9, 7, 3, 4, 6, 8, 8].map((number, index) => <span key={`${number}-${index}`}>{number}</span>)}
        </div>
        <div className={styles.numberRule}><span>{t('site.preview.pairToTen')}</span><strong>+120</strong></div>
      </div>
    );
  }

  if (app.preview === 'arcade') {
    return (
      <div className={`${styles.preview} ${styles.arcadePreview}`} aria-hidden="true">
        <ProductIcon app={app} className={styles.arcadeMark} />
        <div className={styles.arcadeSignal}>{[1, 2, 3, 4, 5].map((value) => <i key={value} />)}</div>
        <span className={styles.arcadeScore}>{t('site.preview.best', { score: '08,420' })}</span>
        <strong>{app.name}</strong>
      </div>
    );
  }

  if (app.preview === 'identity') {
    return (
      <div className={`${styles.preview} ${styles.productPreview}`} aria-hidden="true">
        <span className={styles.productKicker}>{t(app.kind === 'game' ? 'site.preview.arcade' : 'site.preview.utility')}</span>
        <ProductIcon app={app} className={styles.productPreviewIcon} />
        <strong>{app.name}</strong>
        <span className={styles.productPulse} />
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
      <div className={styles.trailInfo}><span>{t('site.preview.trailAtlas')}</span><strong>{t('site.preview.nearby', { count: 8 })}</strong></div>
    </div>
  );
}

interface AppExplorerProps {
  activeId: KortexAppId;
  onSelectApp: (id: KortexAppId) => void;
}

export function AppExplorer({ activeId, onSelectApp }: AppExplorerProps) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [followApp, setFollowApp] = useState<KortexApp | null>(null);
  const activeApp = getKortexApp(activeId) ?? kortexApps[0];
  const activeAppIndex = kortexApps.findIndex((app) => app.id === activeApp.id);
  const visibleApps = useMemo(
    () => category === 'all' ? kortexApps : kortexApps.filter((app) => app.category === category),
    [category],
  );

  useEffect(() => {
    if (category !== 'all' && activeApp.category !== category) setCategory('all');
  }, [activeApp.category, category]);

  const selectCategory = (nextCategory: CategoryFilter) => {
    setCategory(nextCategory);
    const firstMatch = nextCategory === 'all' ? kortexApps[0] : kortexApps.find((app) => app.category === nextCategory);
    if (firstMatch) onSelectApp(firstMatch.id);
  };

  const closeFollowModal = useCallback(() => setFollowApp(null), []);

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
        {categoryFilters.map(([filter, labelKey]) => (
          <button key={filter} className={category === filter ? styles.filterActive : ''} type="button" onClick={() => selectCategory(filter)}>
            {t(labelKey)}
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
              style={{ '--accent': app.accent, '--accent-rgb': app.accentRgb, '--delay': `${index * 70}ms` } as CSSProperties}
              onClick={() => onSelectApp(app.id)}
              aria-pressed={activeId === app.id}
            >
              <span className={styles.cardGlow} />
              <span className={styles.cardTop}>
                <ProductIcon app={app} className={styles.appIcon} />
                <span className={styles.cardLabels}>
                  {app.isNew && <span className={styles.newFlag}>{t('site.newRelease')}</span>}
                  <span className={styles.status}><i />{t(app.statusKey)}</span>
                </span>
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
          style={{ '--accent': activeApp.accent, '--accent-rgb': activeApp.accentRgb } as CSSProperties}
          aria-live="polite"
        >
          <span className={styles.spotlightGlow} />
          <div className={styles.spotlightTop}>
            <div className={styles.spotlightIdentity}>
              <ProductIcon app={activeApp} className={styles.spotlightIcon} />
              <div><span>{t(activeApp.statusKey)}</span><h3>{activeApp.name}</h3></div>
            </div>
            <span className={styles.appNumber}>{String(activeAppIndex + 1).padStart(2, '0')}</span>
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
            <button type="button" onClick={() => setFollowApp(activeApp)}>{t('site.followApp')}</button>
            <a href="#future">{t('site.discoverMore')}<span>{'\u2192'}</span></a>
          </div>
        </article>
      </div>

      {followApp && <FollowAppModal app={followApp} onClose={closeFollowModal} />}

      <div className={styles.future} id="future">
        <div className={styles.futureCopy}>
          <span className={styles.eyebrow}>{t('site.futureEyebrow')}</span>
          <h2>{t('site.libraryFutureTitle', { apps: kortexApps.length, tools: webTools.length })}</h2>
          <p>{t('site.libraryFutureBody')}</p>
        </div>
        <div className={styles.constellation} aria-hidden="true">
          {kortexApps.slice(0, 4).map((app) => <ProductIcon key={app.id} app={app} className={styles.constellationIcon} />)}
          <span><strong>{kortexApps.length + webTools.length}</strong><small>{t('site.products')}</small></span>
        </div>
        <div className={styles.futureBadge}><span>{'\u2726'}</span>{t('site.futureBadge')}</div>
      </div>
    </section>
  );
}
