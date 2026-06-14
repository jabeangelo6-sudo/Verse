"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "tip";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
  amount?: string;
};

type ToastContextType = {
  toast: (type: ToastType, message: string, amount?: string) => void;
};

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-accent-green" />,
  error: <XCircle size={16} className="text-accent-rose" />,
  warning: <AlertCircle size={16} className="text-accent-amber" />,
  tip: <Zap size={16} className="text-accent-amber fill-accent-amber" />,
};

const styles: Record<ToastType, string> = {
  success: "border-accent-green/20 bg-accent-green/10",
  error: "border-accent-rose/20 bg-accent-rose/10",
  warning: "border-accent-amber/20 bg-accent-amber/10",
  tip: "border-accent-amber/20 bg-accent-amber/10",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string, amount?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message, amount }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 md:bottom-6">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl border glass-nav shadow-card", styles[t.type])}
            >
              {icons[t.type]}
              <span className="text-sm text-text-primary flex-1">{t.message}</span>
              {t.amount && (
                <span className="text-sm font-bold text-accent-green">+{t.amount}</span>
              )}
              <button onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))} className="text-text-muted hover:text-text-secondary">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
