import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './KortexOffers.module.css';

type Offer = 'evidence' | 'plus-monthly' | 'plus-yearly';

type StoredEntitlement = {
  licenseKey: string;
  instanceId: string;
  status: 'active';
  productName?: string;
};

const entitlementKey = 'kortex-entitlement';

function readEntitlement(): StoredEntitlement | null {
  try {
    const value = localStorage.getItem(entitlementKey);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<StoredEntitlement>;
    if (
      parsed.status !== 'active'
      || typeof parsed.licenseKey !== 'string'
      || parsed.licenseKey.length < 20
      || typeof parsed.instanceId !== 'string'
      || !parsed.instanceId
      || (parsed.productName !== undefined && typeof parsed.productName !== 'string')
    ) {
      localStorage.removeItem(entitlementKey);
      return null;
    }
    return parsed as StoredEntitlement;
  } catch {
    localStorage.removeItem(entitlementKey);
    return null;
  }
}

export function KortexOffers() {
  const { t } = useTranslation();
  const [checkoutError, setCheckoutError] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseStatus, setLicenseStatus] = useState<'idle' | 'checking' | 'active' | 'error'>(() => readEntitlement() ? 'checking' : 'idle');
  const [licenseMessage, setLicenseMessage] = useState('');

  useEffect(() => {
    const entitlement = readEntitlement();
    if (!entitlement) {
      setLicenseStatus('idle');
      return;
    }

    const controller = new AbortController();
    void fetch('/api/license/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey: entitlement.licenseKey, instanceId: entitlement.instanceId }),
      signal: controller.signal,
    }).then(async (response) => {
      const result = await response.json() as { active?: boolean; error?: string; productName?: string };
      if (response.ok && result.active === true) {
        localStorage.setItem(entitlementKey, JSON.stringify({
          ...entitlement,
          productName: result.productName || entitlement.productName,
        } satisfies StoredEntitlement));
        setLicenseStatus('active');
        setLicenseMessage(t('site.offers.licenseActive'));
        return;
      }
      localStorage.removeItem(entitlementKey);
      setLicenseStatus(response.status >= 500 ? 'error' : 'idle');
      setLicenseMessage(response.status >= 500 ? result.error || t('site.offers.licenseInvalid') : '');
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setLicenseStatus('error');
      setLicenseMessage(t('site.offers.licenseInvalid'));
    });

    return () => controller.abort();
  }, [t]);

  const getProductId = (offer: Offer) => {
    switch (offer) {
      case 'evidence': return import.meta.env.VITE_POLAR_EVIDENCE_PRODUCT_ID || '40632e93-6582-4e02-8e17-cb8f9ed4edc5';
      case 'plus-monthly': return import.meta.env.VITE_POLAR_PLUS_MONTHLY_PRODUCT_ID || '02a86f68-c1bc-44c0-b7a9-fbf97cc65bbe';
      case 'plus-yearly': return import.meta.env.VITE_POLAR_PLUS_YEARLY_PRODUCT_ID || 'c1e02470-714b-4f11-bf53-e703158b89b8';
      default: return '';
    }
  };

  const beginCheckout = async (offer: Offer) => {
    setCheckoutError('');
    try {
      const productId = getProductId(offer);
      if (!productId || productId.includes('your_')) {
        setCheckoutError(t('site.offers.checkoutUnavailable'));
        return;
      }
      window.location.assign(`/checkout?products=${encodeURIComponent(productId)}`);
      return;
      const result = await response.json() as { error?: string };
      setCheckoutError(result.error || t('site.offers.checkoutUnavailable'));
    } catch {
      setCheckoutError(t('site.offers.checkoutUnavailable'));
    }
  };

  const activateLicense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedKey = licenseKey.trim();
    if (!normalizedKey) return;

    setLicenseStatus('checking');
    setLicenseMessage('');
    const deviceId = (() => {
      const existing = localStorage.getItem('kortex-device-id');
      if (existing) return existing;
      const created = crypto.randomUUID();
      localStorage.setItem('kortex-device-id', created);
      return created;
    })();

    try {
      const response = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: normalizedKey, deviceName: `Kortex Web ${deviceId.slice(0, 8)}` }),
      });
      const result = await response.json() as { active?: boolean; error?: string; instanceId?: string; productName?: string };
      if (!response.ok || result.active !== true || !result.instanceId) {
        throw new Error(result.error || t('site.offers.licenseInvalid'));
      }

      localStorage.setItem(entitlementKey, JSON.stringify({
        licenseKey: normalizedKey,
        instanceId: result.instanceId,
        productName: result.productName,
        status: 'active',
      } satisfies StoredEntitlement));
      setLicenseKey('');
      setLicenseStatus('active');
      setLicenseMessage(t('site.offers.licenseActive'));
    } catch (error) {
      localStorage.removeItem(entitlementKey);
      setLicenseStatus('error');
      setLicenseMessage(error instanceof Error ? error.message : t('site.offers.licenseInvalid'));
    }
  };

  return (
    <section className={styles.section} id="plus">
      <div className={styles.heading}>
        <span className={styles.eyebrow}>{t('site.offers.eyebrow')}</span>
        <h2>{t('site.offers.title')}</h2>
        <p>{t('site.offers.subtitle')}</p>
      </div>

      <div className={styles.offerGrid}>
        <article className={`${styles.offer} ${styles.evidenceOffer}`}>
          <span className={styles.offerLabel}>{t('site.offers.evidenceLabel')}</span>
          <h3>{t('site.offers.evidenceTitle')}</h3>
          <p>{t('site.offers.evidenceBody')}</p>
          <ul>
            <li>{t('site.offers.evidenceFeature1')}</li>
            <li>{t('site.offers.evidenceFeature2')}</li>
            <li>{t('site.offers.evidenceFeature3')}</li>
          </ul>
          <div className={styles.price}><strong>$9.99</strong><span>{t('site.offers.oneTime')}</span></div>
          <button type="button" onClick={() => void beginCheckout('evidence')}>{t('site.offers.getEvidence')}</button>
        </article>

        <article className={`${styles.offer} ${styles.plusOffer}`}>
          <span className={styles.popular}>{t('site.offers.bestValue')}</span>
          <span className={styles.offerLabel}>{t('site.offers.plusLabel')}</span>
          <h3>{t('site.offers.plusTitle')}</h3>
          <p>{t('site.offers.plusBody')}</p>
          <ul>
            <li>{t('site.offers.plusFeature1')}</li>
            <li>{t('site.offers.plusFeature2')}</li>
            <li>{t('site.offers.plusFeature3')}</li>
          </ul>
          <div className={styles.price}><strong>$39</strong><span>{t('site.offers.perYear')}</span></div>
          <div className={styles.offerActions}>
            <button type="button" onClick={() => void beginCheckout('plus-yearly')}>{t('site.offers.chooseYearly')}</button>
            <button className={styles.secondaryButton} type="button" onClick={() => void beginCheckout('plus-monthly')}>{t('site.offers.chooseMonthly')}</button>
          </div>
        </article>
      </div>

      {checkoutError && <p className={styles.checkoutError} role="status">{checkoutError} <a href="mailto:support@usekortex.com">support@usekortex.com</a></p>}

      <div className={styles.activate}>
        <div>
          <span className={styles.offerLabel}>{t('site.offers.alreadyPurchased')}</span>
          <h3>{licenseStatus === 'active' ? t('site.offers.activatedTitle') : t('site.offers.activateTitle')}</h3>
          <p>{licenseStatus === 'active' ? t('site.offers.activatedBody') : t('site.offers.activateBody')}</p>
        </div>
        {licenseStatus !== 'active' && (
          <form onSubmit={(event) => void activateLicense(event)}>
            <label htmlFor="license-key">{t('site.offers.licenseLabel')}</label>
            <div>
              <input id="license-key" value={licenseKey} onChange={(event) => setLicenseKey(event.target.value)} placeholder={t('site.offers.licensePlaceholder')} autoComplete="off" required />
              <button type="submit" disabled={licenseStatus === 'checking'}>{licenseStatus === 'checking' ? t('site.offers.activating') : t('site.offers.activate')}</button>
            </div>
          </form>
        )}
        {licenseMessage && <p className={licenseStatus === 'error' ? styles.licenseError : styles.licenseSuccess} role="status">{licenseMessage}</p>}
      </div>
    </section>
  );
}
