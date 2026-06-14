"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  credential: string;
  zkProof?: string;
  compact?: boolean;
};

export function ExpertBadge({ credential, zkProof, compact = false }: Props) {
  const [showProof, setShowProof] = useState(false);

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-green/10 text-accent-green border border-accent-green/20">
        <ShieldCheck size={9} /> {credential}
      </span>
    );
  }

  return (
    <div className="rounded-xl bg-accent-green/6 border border-accent-green/15 p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-accent-green" />
          <span className="text-xs font-bold text-accent-green">Anonymous Expert</span>
        </div>
        <button
          onClick={() => setShowProof(v => !v)}
          className="text-[10px] text-text-muted hover:text-text-secondary flex items-center gap-1 transition-colors"
        >
          {showProof ? <EyeOff size={10} /> : <Eye size={10} />}
          {showProof ? "Hide" : "Verify"}
        </button>
      </div>

      <p className="text-xs text-text-secondary font-medium">{credential}</p>
      <p className="text-[11px] text-text-muted mt-0.5">
        Identity verified via ZK proof — credential is real, identity stays private
      </p>

      <AnimatePresence>
        {showProof && zkProof && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 pt-2 border-t border-accent-green/10"
          >
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
              <Lock size={9} className="text-accent-green" />
              <span className="font-mono text-accent-green/70">{zkProof}</span>
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              Proof verifiable on-chain. No personal data stored.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
