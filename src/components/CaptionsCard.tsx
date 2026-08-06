import { useEffect, useRef, useState } from 'react';
import { useToast } from './useToast';
import styles from './AppCard.module.css';
import phoneStyles from './PhoneMockup.module.css';
import { useTranslation } from 'react-i18next';

const mockCaptions = [
    { text: "Golden hour hits different. 🌅✨ #sunset #chasinglight", img: "https://images.unsplash.com/photo-1614531341624-9b2ee03e4d94?w=400&q=80" },
    { text: "Sunsets are proof that endings can be beautiful too. 🌇💛 #sunsetlovers #view", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
    { text: "Keep your face always toward the sunshine. ☀️🌊 #nature #coast", img: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=400&q=80" },
    { text: "Sky above, sand below, peace within. 🐚🌴 #travelgram #paradise", img: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=400&q=80" }
];

export function CaptionsCard() {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [captionIndex, setCaptionIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const generationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (generationTimeoutRef.current) {
            clearTimeout(generationTimeoutRef.current);
        }
    }, []);

    const handleGenerate = () => {
        setIsGenerating(true);
        generationTimeoutRef.current = setTimeout(() => {
            setCaptionIndex((prev) => (prev + 1) % mockCaptions.length);
            setIsGenerating(false);
            showToast(t('site.demo.captionsGenerated'));
            generationTimeoutRef.current = null;
        }, 800);
    };

    const currentCaption = mockCaptions[captionIndex];

    return (
        <div className={`${styles.appCard} ${styles.captions}`} id="captions-anchor">
            <div>
                <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>✨</div>
                    <div>
                        <h2 className={styles.title}>{t('site.captions')}</h2>
                    </div>
                </div>
                <p className={styles.appDescription}>
                    {t('site.captionsDescription')}
                </p>
                
                <div className={phoneStyles.previewWrapper}>
                    <div className={phoneStyles.phoneFrame}>
                        <div className={phoneStyles.phoneNotch}></div>
                        <div className={phoneStyles.phoneContent}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>
                                <span>{t('site.demo.assistant')}</span>
                                <span style={{ color: 'var(--accent-purple)' }}>{t('site.demo.online')}</span>
                            </div>
                            
                            <div className={phoneStyles.mockCaptionCard}>
                                <div className={phoneStyles.mockImageContainer}>
                                    <img 
                                        src={currentCaption.img} 
                                        alt={t('site.demo.generatedPreview')} 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover', 
                                            zIndex: 2, 
                                            position: 'relative', 
                                            opacity: isGenerating ? 0.5 : 0.9,
                                            transition: 'opacity 0.2s'
                                        }} 
                                    />
                                </div>
                                <textarea 
                                    className={phoneStyles.mockCaptionInput} 
                                    rows={2} 
                                    readOnly 
                                    value={isGenerating ? t('site.demo.generating') : currentCaption.text}
                                />
                                <button className={phoneStyles.mockGenerateBtn} onClick={handleGenerate} disabled={isGenerating}>
                                    {t('site.demo.regenerateCaption')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className={styles.featureList}>
                    <li className={styles.featureItem}>
                        <svg strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        {t('site.demo.captionsFeatureAnalysis')}
                    </li>
                    <li className={styles.featureItem}>
                        <svg strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        {t('site.demo.captionsFeatureStyle')}
                    </li>
                    <li className={styles.featureItem}>
                        <svg strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        {t('site.demo.captionsFeatureShare')}
                    </li>
                </ul>
            </div>
            <div className={styles.btnGroup}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => showToast(t('site.demo.captionsIosToast'))}>
                    {t('site.demo.downloadIos')}
                </button>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => showToast(t('site.demo.captionsAndroidToast'))}>
                    {t('site.demo.downloadAndroid')}
                </button>
            </div>
        </div>
    );
}
