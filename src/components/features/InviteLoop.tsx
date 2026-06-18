"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Copy, Check, Twitter, MessageCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";
import config from "@/lib/config";

const REWARDS = [
  { count: 1,  reward: "Founding Inviter badge",          icon: "🎖️" },
  { count: 5,  reward: "+25 reputation points",           icon: "⚡" },
  { count: 10, reward: "Early Creator status forever",    icon: "🌟" },
  { count: 25, reward: "5% rev share on invitees' tips",  icon: "💰" },
];

export function InviteLoop({ username, inviteCount = 0 }: { username: string; inviteCount?: number }) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `https://${config.domain}/invite/${username}`;

  const copy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = `I'm building my audience on ${config.name} — the censorship-proof creator platform where YOU own your followers forever.\n\nNo algorithm. No middleman. Just you and your fans.\n\nJoin with my link 👇`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(inviteUrl)}`, "_blank");
  };

  const shareWhatsApp = () => {
    const text = `Join me on ${config.name} — own your audience forever 👇\n${inviteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const nextReward = REWARDS.find(r => r.count > inviteCount);
  const progress = nextReward ? Math.min((inviteCount / nextReward.count) * 100, 100) : 100;

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Gift size={16} className="text-accent-amber" />
        <span className="font-semibold text-text-primary text-sm">Invite & Earn</span>
        <span className="ml-auto badge badge-green text-[10px]">{inviteCount} invited</span>
      </div>

      {/* Invite link */}
      <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3 py-2.5 border border-border">
        <Link2 size={12} className="text-text-muted flex-shrink-0" />
        <span className="text-xs text-text-secondary truncate flex-1">{config.domain}/invite/{username}</span>
        <button onClick={copy} className="flex-shrink-0 text-primary-light hover:text-primary transition-colors ml-1">
          <AnimatePresence mode="wait">
            {copied
              ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={13} className="text-accent-green" /></motion.span>
              : <motion.span key="u" initial={{ scale: 0 }} animate={{ scale: 1 }}><Copy size={13} /></motion.span>}
          </AnimatePresence>
        </button>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" fullWidth onClick={shareTwitter}>
          <Twitter size={13} /> Post on X
        </Button>
        <Button variant="secondary" size="sm" fullWidth onClick={shareWhatsApp}>
          <MessageCircle size={13} /> WhatsApp
        </Button>
      </div>

      {/* Progress bar */}
      {nextReward && (
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-text-muted">{nextReward.count - inviteCount} more to unlock</span>
            <span className="text-accent-amber font-semibold">{nextReward.icon} {nextReward.reward}</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-accent-amber to-accent-green rounded-full"
            />
          </div>
        </div>
      )}

      {/* Rewards ladder */}
      <div className="space-y-2 pt-1 border-t border-border">
        {REWARDS.map(r => {
          const unlocked = inviteCount >= r.count;
          return (
            <div key={r.count} className={`flex items-center gap-2 text-xs ${unlocked ? "text-accent-green" : "text-text-muted"}`}>
              <span>{r.icon}</span>
              <span className="flex-1">{r.reward}</span>
              <span className={`font-bold ${unlocked ? "text-accent-green" : "text-text-muted"}`}>{r.count} invites</span>
              {unlocked && <Check size={10} className="text-accent-green" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
