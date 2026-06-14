"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Bot, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  score: number;
  isVerified: boolean;
  compact?: boolean;
};

export function HumanityBadge({ score, isVerified, compact = false }: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const label = score >= 90 ? "Human verified" : score >= 70 ? "Likely human" : "AI suspected";
  const color = score >= 90
    ? "text-accent-green bg-accent-green/10 border-accent-green/20"
    : score >= 70
    ? "text-accent-amber bg-accent-amber/10 border-accent-amber/20"
    : "text-accent-rose bg-accent-rose/10 border-accent-rose/20";
  const Icon = score >= 70 ? Fingerprint : Bot;

  if (compact) {
    return (
      <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border", color)}>
        <Icon size={9} /> {score}%
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowInfo(v => !v)}
        className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all", color)}
      >
        <Icon size={11} />
        {label}
        <Info size={9} className="opacity-60" />
      </button>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            className="absolute top-full left-0 mt-2 w-52 glass border border-border rounded-xl p-3 z-50 shadow-card"
          >
            <p className="text-xs font-semibold text-text-primary mb-1">Proof of Humanity</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", score >= 90 ? "bg-accent-green" : score >= 70 ? "bg-accent-amber" : "bg-accent-rose")}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-xs font-bold text-text-primary">{score}%</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              AI analyzes writing patterns, timing, and on-chain behavior to score human authenticity. Stored on-chain permanently.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
