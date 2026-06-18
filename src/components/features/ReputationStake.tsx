"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, TrendingUp, TrendingDown, Clock, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type Props = {
  topic: string;
  stakeAmount: number;
  yesVotes: number;
  noVotes: number;
  deadline: Date;
  creatorName: string;
  tokenSymbol: string;
};

export function ReputationStake({ topic, stakeAmount, yesVotes, noVotes, deadline, creatorName }: Props) {
  const [open, setOpen] = useState(false);
  const [userStake, setUserStake] = useState<"yes" | "no" | null>(null);
  const [amount, setAmount] = useState("");
  const [staking, setStaking] = useState(false);
  const { toast } = useToast();

  const total = yesVotes + noVotes;
  const yesPercent = total > 0 ? Math.round((yesVotes / total) * 100) : 50;
  const noPercent = 100 - yesPercent;
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleStake = async (side: "yes" | "no") => {
    if (!amount || Number(amount) <= 0) { toast("warning", "Enter an amount to stake"); return; }
    setStaking(true);
    await new Promise(r => setTimeout(r, 1400));
    setStaking(false);
    setUserStake(side);
    toast("success", `Staked $${amount} on "${side === "yes" ? "TRUE" : "FALSE"}"`);
    setOpen(false);
  };

  return (
    <div className="mt-3 rounded-xl bg-accent-amber/5 border border-accent-amber/15 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 p-3 hover:bg-white/[0.02] transition-colors text-left">
        <Target size={14} className="text-accent-amber flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-bold text-accent-amber uppercase tracking-wide">Reputation Stake</span>
            <span className="text-[10px] text-text-muted">· ${stakeAmount} at risk</span>
          </div>
          <p className="text-xs text-text-primary font-medium truncate">"{topic}"</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Clock size={10} className="text-text-muted" />
          <span className="text-[10px] text-text-muted">{daysLeft}d left</span>
          <ChevronDown size={12} className={cn("text-text-muted transition-transform", open && "rotate-180")} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-accent-amber/10">
            <div className="p-3 space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-accent-green font-semibold">TRUE {yesPercent}%</span>
                  <span className="text-accent-rose font-semibold">{noPercent}% FALSE</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-white/[0.06] flex">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${yesPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }} className="h-full bg-accent-green rounded-l-full" />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${noPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }} className="h-full bg-accent-rose rounded-r-full" />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span>{yesVotes.toLocaleString()} staked</span>
                  <span>{noVotes.toLocaleString()} staked</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Zap size={11} className="text-accent-amber fill-accent-amber" />
                <span><span className="font-semibold text-text-primary">{creatorName}</span> staked <span className="text-accent-amber font-bold">${stakeAmount}</span> on TRUE — loses it if wrong</span>
              </div>

              {!userStake ? (
                <div>
                  <input type="number" placeholder="Amount in USD" value={amount}
                    onChange={e => setAmount(e.target.value)} className="input-base h-9 text-sm mb-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="sm" loading={staking} onClick={() => handleStake("yes")}
                      className="gap-1.5 border-accent-green/25 text-accent-green hover:bg-accent-green/10">
                      <TrendingUp size={12} /> Bet TRUE
                    </Button>
                    <Button variant="secondary" size="sm" loading={staking} onClick={() => handleStake("no")}
                      className="gap-1.5 border-accent-rose/25 text-accent-rose hover:bg-accent-rose/10">
                      <TrendingDown size={12} /> Bet FALSE
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={cn("text-xs font-semibold text-center py-2 rounded-lg",
                  userStake === "yes" ? "bg-accent-green/10 text-accent-green" : "bg-accent-rose/10 text-accent-rose")}>
                  You staked ${amount} on {userStake === "yes" ? "TRUE ✓" : "FALSE ✗"}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
