"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Users, Trophy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  followerCountAtFollow: number;
  threshold: number;
  rank?: number;
  compact?: boolean;
};

export function EarlyBelieverBadge({ followerCountAtFollow, threshold, rank, compact = false }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isEarly = followerCountAtFollow < threshold;
  if (!isEarly) return null;

  const tier = followerCountAtFollow < 100 ? "genesis" : followerCountAtFollow < 500 ? "founding" : "early";
  const tierConfig = {
    genesis: { label: "Genesis", color: "text-accent-amber", bg: "bg-accent-amber/15 border-accent-amber/30", glow: "shadow-[0_0_12px_rgba(245,158,11,0.3)]" },
    founding: { label: "Founding", color: "text-primary-light", bg: "bg-primary/15 border-primary/30", glow: "shadow-[0_0_12px_rgba(124,58,237,0.3)]" },
    early: { label: "Early", color: "text-accent-cyan", bg: "bg-accent-cyan/10 border-accent-cyan/25", glow: "" },
  }[tier];

  if (compact) {
    return (
      <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border", tierConfig.bg, tierConfig.color)}>
        <Star size={8} className="fill-current" /> {tierConfig.label}
      </span>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer", tierConfig.bg, tierConfig.glow)}
      >
        <Star size={14} className={cn("fill-current", tierConfig.color)} />
        <div>
          <div className={cn("text-xs font-bold", tierConfig.color)}>{tierConfig.label} Believer</div>
          <div className="text-[10px] text-text-muted">Followed at {followerCountAtFollow.toLocaleString()} followers</div>
        </div>
        {rank && <Trophy size={12} className="text-accent-amber ml-1" />}
      </motion.div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-56 glass border border-border rounded-xl p-3 z-50 shadow-card"
          >
            <p className="text-xs font-semibold text-text-primary mb-1">On-chain proof of early support</p>
            <p className="text-[11px] text-text-muted leading-relaxed">
              You followed this creator before they hit {threshold.toLocaleString()} followers.
              This badge is permanently stored on-chain and can never be revoked.
            </p>
            {rank && (
              <div className="mt-2 pt-2 border-t border-border text-[11px] text-accent-amber font-semibold">
                #{rank} earliest believer
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
