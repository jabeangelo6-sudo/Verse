"use client";
import { ReactNode, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ANCHOR_CLASS = {
  "top-left":     "top-full left-0 mt-1.5",
  "top-right":    "top-full right-0 mt-1.5",
  "bottom-left":  "bottom-full left-0 mb-1.5",
  "bottom-right": "bottom-full right-0 mb-1.5",
} as const;

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  anchor?: keyof typeof ANCHOR_CLASS;
}

export function Popover({ open, onClose, children, className, anchor = "top-right" }: Props) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    // setTimeout skips the click that opened the popover so it doesn't
    // immediately close. document-level listener works regardless of
    // CSS stacking contexts (fixed inside transformed parents breaks).
    let removeListener: (() => void) | undefined;
    const t = setTimeout(() => {
      const handler = () => onCloseRef.current();
      document.addEventListener("click", handler, { once: true });
      removeListener = () => document.removeEventListener("click", handler);
    }, 0);
    return () => {
      clearTimeout(t);
      removeListener?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn("absolute z-10", ANCHOR_CLASS[anchor], className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
