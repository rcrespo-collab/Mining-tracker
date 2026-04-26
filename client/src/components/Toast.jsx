import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in ${
            t.type === 'error' ? 'bg-red-900 border border-red-700 text-red-200' :
            t.type === 'warning' ? 'bg-yellow-900 border border-yellow-700 text-yellow-200' :
            'bg-[#1A2D1A] border border-green-800 text-green-200'
          }`}>
            <span>{t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : '✓'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
