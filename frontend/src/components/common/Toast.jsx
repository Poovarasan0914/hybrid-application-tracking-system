import { createContext, useContext, useEffect, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [timer, setTimer] = useState(null);

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => setToast(prev => ({ ...prev, open: false }));

  const success = (message) => showToast(message, 'success');
  const error = (message) => showToast(message, 'error');
  const warning = (message) => showToast(message, 'warning');
  const info = (message) => showToast(message, 'info');

  useEffect(() => {
    if (toast.open) {
      if (timer) clearTimeout(timer);
      const t = setTimeout(() => hideToast(), 4000);
      setTimer(t);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [toast.open]);

  const colors = {
    success: { bg: '#d1e7dd', color: '#0f5132', border: '#badbcc' },
    error: { bg: '#f8d7da', color: '#842029', border: '#f5c2c7' },
    warning: { bg: '#fff3cd', color: '#664d03', border: '#ffecb5' },
    info: { bg: '#cff4fc', color: '#055160', border: '#b6effb' }
  };

  const style = colors[toast.severity] || colors.info;

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      {toast.open && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999 }}>
          <div style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}`, borderRadius: 6, padding: '8px 12px', boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }}>
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};