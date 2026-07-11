import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Toast.module.css';
import { ToastContext } from './ToastContext';

export function ToastProvider({ children }: { children: ReactNode }) {
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({
        message: '',
        isVisible: false,
    });

    const showToast = useCallback((message: string) => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }

        setToast({ message, isVisible: true });
        hideTimeoutRef.current = setTimeout(() => {
            setToast((prev) => ({ ...prev, isVisible: false }));
            hideTimeoutRef.current = null;
        }, 3500);
    }, []);

    useEffect(() => () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
    }, []);

    const contextValue = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className={`${styles.toast} ${toast.isVisible ? styles.show : ''}`}>
                <span className={styles.toastIcon}>🚀</span>
                <span className={styles.toastMessage}>{toast.message}</span>
            </div>
        </ToastContext.Provider>
    );
}
