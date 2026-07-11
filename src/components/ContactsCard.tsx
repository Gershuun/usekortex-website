import { useState } from 'react';
import { useToast } from './useToast';
import styles from './AppCard.module.css';
import phoneStyles from './PhoneMockup.module.css';

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
        successMessage: 'Contact standardized successfully!',
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
        successMessage: 'Duplicate contacts merged!',
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
        successMessage: 'Contact formatted to E.164!',
        isFixed: false
    }
];

export function ContactsCard() {
    const { showToast } = useToast();
    const [contacts, setContacts] = useState(initialContacts);

    const handleFix = (id: number) => {
        const contact = contacts.find((candidate) => candidate.id === id);
        if (!contact || contact.isFixed) return;

        showToast(contact.successMessage);
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
                    <div className={styles.cardIcon}>📇</div>
                    <div>
                        <h2 className={styles.title}>Kortex Contacts</h2>
                    </div>
                </div>
                <p className={styles.appDescription}>
                    A privacy-first address book optimizer that scans, merges, and standardizes your mobile contacts safely and 100% on-device.
                </p>
                
                <div className={phoneStyles.previewWrapper}>
                    <div className={phoneStyles.phoneFrame}>
                        <div className={phoneStyles.phoneNotch}></div>
                        <div className={phoneStyles.phoneContent}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
                                <span>Contacts</span>
                                <span style={{ color: 'var(--accent-blue)' }}>Local Scan</span>
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
                                            {c.isDuplicate ? 'Merge' : 'Fix'}
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
                        Phonetic smart duplicate merge
                    </li>
                    <li className={styles.featureItem}>
                        <svg strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        Automatic phone layout standardizer
                    </li>
                    <li className={styles.featureItem}>
                        <svg strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        Instant VCF / Local backups
                    </li>
                </ul>
            </div>
            <div className={styles.btnGroup}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => showToast('TestFlight build is currently in review. Check back soon!')}>
                    Download on iOS
                </button>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => showToast('Android build is currently in review. Check back soon!')}>
                    Download on Android
                </button>
            </div>
        </div>
    );
}
