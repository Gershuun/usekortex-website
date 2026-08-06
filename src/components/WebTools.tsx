import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { webTools } from '../data/webTools';
import styles from './WebTools.module.css';

const groupLabels = {
  everyday: 'Everyday',
  evidence: 'Evidence',
  safety: 'Safety',
  focus: 'Focus',
} as const;

export function WebTools() {
  const { t } = useTranslation();

  return (
    <section className={styles.section} id="web-tools">
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>{t('site.tools.eyebrow')}</span>
          <h2>{t('site.tools.title')}</h2>
        </div>
        <p>{t('site.tools.subtitle')}</p>
      </div>

      <div className={styles.promiseBar}>
        <span><i />{t('site.tools.promiseInstall')}</span>
        <span><i />{t('site.tools.promiseOffline')}</span>
        <span><i />{t('site.tools.promisePrivate')}</span>
        <span><i />{t('site.tools.promiseAccount')}</span>
      </div>

      <div className={styles.grid}>
        {webTools.map((tool, index) => (
          <a
            key={tool.id}
            className={styles.card}
            href={tool.href}
            style={{
              '--tool-accent': tool.accent,
              '--tool-accent-rgb': tool.accentRgb,
              '--tool-delay': `${index * 45}ms`,
            } as CSSProperties}
          >
            <span className={styles.glow} />
            <span className={styles.cardTop}>
              <img src={tool.icon} alt="" />
              <span className={styles.group}>{groupLabels[tool.group]}</span>
            </span>
            <span className={styles.cardCopy}>
              <span className={styles.productName}>{tool.name}</span>
              <strong>{t(tool.taglineKey)}</strong>
              <span className={styles.description}>{t(tool.descriptionKey)}</span>
            </span>
            <span className={styles.cardAction}>
              <span>{t('site.tools.open')}</span>
              {'premium' in tool && tool.premium === 'evidence' && <small>{t('site.tools.evidenceReady')}</small>}
              <b aria-hidden="true">{'↗'}</b>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
