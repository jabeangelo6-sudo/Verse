"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, TrendingUp, Star, Lock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { type Creator } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Props = { creator: Creator };

const TIERS = [
  { name: "Founding", slots: 50, price: 0.12, perks: ["Exclusive content forever", "Early access to drops", "Direct message access", "NFT appreciates as creator grows"], color: "from-accent-amber/20 to-accent-amber/5", border: "border-accent-amber/30", badge: "text-accent-amber" },
  { name: "Supporter", slots: 200, price: 0.04, perks: ["Token-gated content", "Early access to posts", "Supporter badge on profile"], color: "from-primary/20 to-primary/5", border: "border-primary/30", badge: "text-primary-light" },
  { name: "Fan", slots: 500, price: 0.01, perks: ["Fan badge on profile", "Access to community chat"], color: "from-accent-cyan/15 to-accent-cyan/5", border: "border-accent-cyan/25", badge: "text-accent-cyan" },
];

export function SubscriptionNFT({ creator }: Props) {
  const [open, setOpen] = useState(false);
  const [minting, setMinting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMint = async (tier: typeof TIERS[0]) => {
    setMinting(tier.name);
    await new Promise(r => setTimeout(r, 1800));
    setMinting(null);
    setOpen(false);
    toast("success", `Minted ${tier.name} Subscriber NFT #${Math.floor(Math.random() * tier.slots) + 1}`, `${tier.price} ETH`);
  };

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Ticket size={16} className="text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-text-primary">Subscription NFTs</div>
            <div className="text-xs text-text-muted">Own your subscription · Resell anytime</div>
          </div>
        </div>
        <ChevronDown size={16} className={cn("text-text-muted transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
              <p className="text-xs text-text-muted mb-3">
                Your subscription is an NFT you own. Early subscriber NFTs appreciate as <span className="text-text-primary font-medium">@{creator.username}</span> grows.
              </p>
              {TIERS.map(tier => (
                <div key={tier.name} className={cn("rounded-xl p-3 bg-gradient-to-r border", tier.color, tier.border)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star size={12} className={cn("fill-current", tier.badge)} />
                      <span className={cn("text-sm font-bold", tier.badge)}>{tier.name}</span>
                      <span className="text-xs text-text-muted">· {tier.slots} total</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">{tier.price} ETH</span>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {tier.perks.map(p => (
                      <li key={p} className="text-[11px] text-text-secondary flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-text-muted" /> {p}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    loading={minting === tier.name}
                    onClick={() => handleMint(tier)}
                    className="text-xs"
                  >
                    <TrendingUp size={11} /> Mint NFT
                  </Button>
                </div>
              ))}
              <p className="text-[10px] text-text-muted text-center pt-1">
                NFTs tradeable on any marketplace · 10% royalty to creator on resale
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
