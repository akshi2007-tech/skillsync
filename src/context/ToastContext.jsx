import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast: addToast, success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error'), info: (msg) => addToast(msg, 'info') }}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="fixed bottom-20 right-4 z-50 flex w-full max-w-sm flex-col gap-2 pointer-events-none md:bottom-6 md:right-6">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              role="status"
              className={`pointer-events-auto flex items-center justify-between rounded-2xl border p-4 text-sm font-semibold shadow-lg backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-[#DCE8D6] text-[#29482d] border-[#a9c39d] dark:bg-[#303a2d] dark:text-[#e1f0d8] dark:border-[#506348]'
                  : toast.type === 'error'
                  ? 'bg-[#FBE1D0] text-[#783f31] border-[#e3b8a1] dark:bg-[#40312b] dark:text-[#f4d5c5] dark:border-[#755344]'
                  : 'bg-[#D8E8F4] text-[#28536a] border-[#b0ccd9] dark:bg-[#29363d] dark:text-[#d6edf4] dark:border-[#3c555e]'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-[#4f8054]" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-[#a75543]" />}
                {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-[#3986a0]" />}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="p-1 hover:opacity-75 rounded-lg transition-opacity ml-2 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
