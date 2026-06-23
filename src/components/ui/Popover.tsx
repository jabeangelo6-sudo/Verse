"use client";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Which corner of the trigger the popover should anchor from */
  anchor?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const ANCHOR_CLASS: Record<NonNullable<Props["anchor"]>, string> = {
  "top-left":     "top-full left-0 mt-1.5",
  "top-right":    "top-full right-0 mt-1.5",
  "bottom-left":  "bottom-full left-0 mb-1.5",
  "bottom-right": "bottom-full right-0 mb-1.5",
};

export function Popover({ open, onClose, children, className, anchor = "top-right" }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Invisible backdrop catches any outside click */}
          <div className="fixed inset-0 z-[9]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn("absolute z-10", ANCHOR_CLASS[anchor], className)}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
