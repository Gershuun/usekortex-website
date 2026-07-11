import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './Toast.module.css';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({
        message: '',
        isVisible: false,
    });

    const showToast = (message: string) => {
        setToast({ message, isVisible: true });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, isVisible: false }));
        }, 3500);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={`${styles.toast} ${toast.isVisible ? styles.show : ''}`}>
                <span className={styles.toastIcon}>🚀</span>
                <span className={styles.toastMessage}>{toast.message}</span>
            </div>
        </ToastContext.Provider>
    );
}
