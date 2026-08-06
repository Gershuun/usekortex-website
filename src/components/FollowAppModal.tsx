import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { KortexApp } from '../data/apps';
import styles from './FollowAppModal.module.css';

interface FollowAppModalProps { app: KortexApp; onClose: () => void; }

export function FollowAppModal({ app, onClose }: FollowAppModalProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLElement | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      requestRef.current?.abort();
      previouslyFocusedRef.current?.focus();
    };
  }, [onClose]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('sending');
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, app: app.id, company, language: navigator.language }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Signup failed');
      setState('success');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setState('error');
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  };

  const keepFocusInside = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(modalRef.current?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
    ) ?? []);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} onKeyDown={keepFocusInside}>
        <button className={styles.close} type="button" onClick={onClose} aria-label={t('site.followClose')}>×</button>
        {state === 'success' ? (
          <div className={styles.success}>
            <span className={styles.successIcon}>✓</span>
            <h2 id={titleId}>{t('site.followSuccess')}</h2>
            <p id={descriptionId}>{t('site.followSuccessBody', { app: app.name })}</p>
            <button type="button" className={styles.primaryButton} onClick={onClose}>{t('site.followDone')}</button>
          </div>
        ) : (
          <>
            <span className={styles.eyebrow}>{app.name}</span>
            <h2 id={titleId}>{t('site.followTitle')}</h2>
            <p id={descriptionId} className={styles.body}>{t('site.followBody')}</p>
            <form onSubmit={submit}>
              <label htmlFor="follow-email">{t('site.followEmailLabel')}</label>
              <input
                id="follow-email"
                name="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (state === 'error') setState('idle');
                }}
                placeholder={t('site.followEmailPlaceholder')}
              />
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
