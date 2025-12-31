import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
}

interface ToastContextType {
    showToast: (type: Toast['type'], message: string, title?: string) => void;
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: Toast['type'], message: string, title?: string) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: Toast = { id, type, message, title };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const showSuccess = useCallback((message: string, title?: string) => {
        showToast('success', message, title);
    }, [showToast]);

    const showError = useCallback((message: string, title?: string) => {
        showToast('error', message, title);
    }, [showToast]);

    const showWarning = useCallback((message: string, title?: string) => {
        showToast('warning', message, title);
    }, [showToast]);

    const showInfo = useCallback((message: string, title?: string) => {
        showToast('info', message, title);
    }, [showToast]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
                {toasts.map((toast) => (
                    <ToastNotification key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastNotification: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info
    };

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-900',
        error: 'bg-red-50 border-red-200 text-red-900',
        warning: 'bg-amber-50 border-amber-200 text-amber-900',
        info: 'bg-blue-50 border-blue-200 text-blue-900'
    };

    const iconColors = {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-amber-600',
        info: 'text-blue-600'
    };

    const Icon = icons[toast.type];

    return (
        <div
            className={`${colors[toast.type]} border-2 rounded-2xl p-4 shadow-2xl backdrop-blur-sm animate-slide-in-right flex items-start space-x-3`}
        >
            <Icon className={`w-6 h-6 ${iconColors[toast.type]} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <h4 className="font-bold text-sm mb-1">{toast.title}</h4>
                )}
                <p className="text-sm">{toast.message}</p>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:bg-black/5 rounded-lg p-1 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
