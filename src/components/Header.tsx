import styles from './Header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <a href="/" className={styles.logo}>Kortex</a>
            <nav className={styles.navLinks}>
                <a href="#contacts-anchor" className={styles.navLink}>Contacts</a>
                <a href="#captions-anchor" className={styles.navLink}>Captions</a>
            </nav>
        </header>
    );
}
