import { useState } from 'react';
import { useToast } from './useToast';
import styles from './AppCard.module.css';
import phoneStyles from './PhoneMockup.module.css';
import { useTranslation } from 'react-i18next';

interface Contact {
    id: number;
    avatar: string;
    initials: string;
    name: string;
    phone: string;
    isDuplicate: boolean;
    fixedName: string;
    fixedPhone: string;
    successMessage: string;
    isFixed: boolean;
}

const initialContacts: Contact[] = [
    {
        id: 1,
        avatar: 'linear-gradient(135deg, var(--accent-blue) 0%, rgba(59,130,246,0.3) 100%)',
        initials: 'JD',
        name: 'John Doe',
        phone: '5550192831',
        isDuplicate: false,
        fixedName: 'John Doe',
        fixedPhone: '+1 (555) 019-2831',
        successMessage: 'site.demo.contactStandardized',
        isFixed: false
    },
    {
        id: 2,
        avatar: 'linear-gradient(135deg, var(--accent-purple) 0%, rgba(139,92,246,0.3) 100%)',
        initials: 'AS',
        name: 'Alice Smith',
        phone: '555-0142 (Duplicate)',
        isDuplicate: true,
        fixedName: 'Alice Smith',
        fixedPhone: '555-0142',
        successMessage: 'site.demo.contactMerged',
        isFixed: false
    },
    {
        id: 3,
        avatar: 'linear-gradient(135deg, var(--accent-blue) 0%, rgba(59,130,246,0.3) 100%)',
        initials: 'BK',
        name: 'Bob K. (iCloud)',
        phone: '15550198822',
        isDuplicate: false,
        fixedName: 'Bob K.',
        fixedPhone: '+1 (555) 019-8822',
        successMessage: 'site.demo.contactFormatted',
        isFixed: false
    }
];

export function ContactsCard() {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [contacts, setContacts] = useState(initialContacts);

    const handleFix = (id: number) => {
        const contact = contacts.find((candidate) => candidate.id === id);
        if (!contact || contact.isFixed) return;

        showToast(t(contact.successMessage));
        setContacts((prev) => prev.map((candidate) => (
            candidate.id === id
                ? { ...candidate, isFixed: true, name: candidate.fixedName, phone: candidate.fixedPhone }
                : candidate
        )));
    };

    return (
        <div className={`${styles.appCard} ${styles.contacts}`} id="contacts-anchor">
            <div>
                <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>Ã°Å¸â€œâ€¡</div>
                    <div>
                        <h2 className={styles.title}>Kortex Contacts</h2>
                    </div>
                </div>
                <p className={styles.appDescription}>
                    {t('site.contactsDescription')}
                </p>
                
                <div className={phoneStyles.previewWrapper}>
                    <div className={phoneStyles.phoneFrame}>
                        <div className={phoneStyles.phoneNotch}></div>
                        <div className={phoneStyles.phoneContent}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
                                <span>{t('site.demo.contactsTitle')}</span>
                                <span style={{ color: 'var(--accent-blue)' }}>{t('site.demo.localScan')}</span>
                            </div>
                            
                            {contacts.map(c => (
                                <div key={c.id} className={phoneStyles.mockContactItem}>
                                    <div className={phoneStyles.mockAvatar} style={{ background: c.avatar }}>
                                        {c.initials}
                                    </div>
                                    <div className={phoneStyles.mockContactInfo}>
                                        <span className={phoneStyles.mockName}>{c.name}</span>
                                        <span className={phoneStyles.mockPhone}>{c.phone}</span>
                                    </div>
                                    {!c.isFixed && (
                                        <button 
                                            className={`${phoneStyles.mockActionBtn} ${c.isDuplicate ? phoneStyles.mockActionBtnPurple : ''}`}
                                            onClick={() => handleFix(c.id)}
                                        >
                                            {c.isDuplicate ? t('site.demo.merge') : t('site.demo.fix')}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <ul className={styles.featureList}>
                    <li className={styles.featureItem}>
                        <svg strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        {t('site.demo.contactsFeatureMerge')}
                    </li>
                    <li className={styles.featureItem}>
                        <svg strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        {t('site.demo.contactsFeatureFormat')}
                    </li>
                    <li className={styles.featureItem}>
                        <svg strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        {t('site.demo.contactsFeatureBackup')}
                    </li>
                </ul>
            </div>
            <div className={styles.btnGroup}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => showToast(t('site.demo.contactsIosToast'))}>
                    {t('site.demo.downloadIos')}
                </button>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => showToast(t('site.demo.contactsAndroidToast'))}>
                    {t('site.demo.downloadAndroid')}
                </button>
            </div>
        </div>
    );
}
