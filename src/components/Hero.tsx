import styles from './Hero.module.css';

export function Hero() {
    return (
        <div className={styles.hero}>
            <div className={styles.badge}>
                <span></span> Kortex ecosystem
            </div>
            <h1 className={styles.title}>Premium Mobile Utility Apps</h1>
            <p className={styles.tagline}>Intelligent, privacy-first mobile tools tailored natively for iOS and Android.</p>
        </div>
    );
}
