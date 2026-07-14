import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { KortexApp } from '../data/apps';
import styles from './FollowAppModal.module.css';

interface FollowAppModalProps { app: KortexApp; onClose: () => void; }

export function FollowAppModal({ app, onClose }: FollowAppModalProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('sending');
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, app: app.id, appName: app.name, company, language: navigator.language }),
      });
      if (!response.ok) throw new Error('Signup failed');
      setState('success');
    } catch { setState('error'); }
  };

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="follow-title">
        <button className={styles.close} type="button" onClick={onClose} aria-label={t('site.followClose')}>×</button>
        {state === 'success' ? (
          <div className={styles.success}>
            <span className={styles.successIcon}>✓</span>
            <h2 id="follow-title">{t('site.followSuccess')}</h2>
            <p>{t('site.followSuccessBody', { app: app.name })}</p>
            <button type="button" className={styles.primaryButton} onClick={onClose}>{t('site.followDone')}</button>
          </div>
        ) : (
          <>
            <span className={styles.eyebrow}>{app.name}</span>
            <h2 id="follow-title">{t('site.followTitle')}</h2>
            <p className={styles.body}>{t('site.followBody')}</p>
            <form onSubmit={submit}>
              <label htmlFor="follow-email">{t('site.followEmailLabel')}</label>
              <input id="follow-email" name="email" type="email" required autoFocus value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('site.followEmailPlaceholder')} />
              <input className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" value={company} onChange={(event) => setCompany(event.target.value)} name="company" />
              {state === 'error' && <p className={styles.error}>{t('site.followError')}</p>}
              <button className={styles.primaryButton} type="submit" disabled={state === 'sending'}>{state === 'sending' ? t('site.followSending') : t('site.followSubmit')}</button>
            </form>
            <small>{t('site.followPrivacy')}</small>
          </>
        )}
      </section>
    </div>
  );
}