"use client";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";
import config from "@/lib/config";

const PERKS = [
  { label: "Founding Member badge", icon: "🎖️" },
  { label: "Early Creator status",  icon: "⚡" },
  { label: "Bonus reputation pts",  icon: "🌟" },
];

export default function InvitePage({ params }: { params: { code: string } }) {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      sessionStorage.setItem("invitedBy", params.code);
      router.replace("/");
    }
  }, [ready, authenticated, router, params.code]);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-accent-amber/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/8 blur-[100px] rounded-full" />
      </div>

      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow-primary animate-pulse-glow">
          <Zap size={28} className="text-white fill-white" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative max-w-sm w-full">
        <div className="inline-flex items-center gap-2 bg-accent-amber/10 border border-accent-amber/20 rounded-full px-3 py-1.5 mb-5">
          <Gift size={13} className="text-accent-amber" />
          <span className="text-xs text-accent-amber font-semibold">@{params.code} invited you</span>
        </div>

        <h1 className="text-4xl font-bold font-display mb-3">
          <span className="gradient-text">You&apos;re in.</span>
          <br />
          <span className="text-text-primary">Own it forever.</span>
        </h1>

        <p className="text-text-secondary mb-2">
          {config.name} is the creator platform where your audience, content, and earnings are yours — on-chain, forever.
        </p>
        <p className="text-sm text-accent-amber font-medium mb-8">
          Join through this invite → both of you unlock exclusive rewards.
        </p>

        {/* Perks */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {PERKS.map(p => (
            <div key={p.label} className="card p-3 text-center">
              <div className="text-2xl mb-1">{p.icon}</div>
              <div className="text-[10px] text-text-muted leading-tight">{p.label}</div>
            </div>
          ))}
        </div>

        <Button variant="gradient" size="lg" fullWidth onClick={login} disabled={!ready} loading={!ready} className="text-base gap-2">
          <Zap size={18} className="fill-white" />
          Accept invite &amp; join {config.name}
        </Button>
        <p className="text-xs text-text-muted mt-3">Free forever · No credit card · Wallet created automatically</p>
      </motion.div>
    </div>
  );
}
