import type { ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <>
            <div className={styles.ambientGlowWrapper}>
                <div className={`${styles.ambientGlow} ${styles.glowBlue}`}></div>
                <div className={`${styles.ambientGlow} ${styles.glowPurple}`}></div>
            </div>
            {children}
        </>
    );
}
