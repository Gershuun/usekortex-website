import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div>&copy; 2026 Kortex. All rights reserved.</div>
            <div className={styles.footerNav}>
                <a href="/contacts/privacy/" className={styles.footerLink}>Privacy Policy</a>
                <a href="mailto:support@usekortex.com" className={styles.footerLink}>Support</a>
            </div>
        </footer>
    );
}
