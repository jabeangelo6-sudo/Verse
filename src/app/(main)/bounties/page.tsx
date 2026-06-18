"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, Clock, Users, TrendingUp, Plus, CheckCircle, ChevronRight, Target } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "active" | "mine" | "completed";
type Metric = "views" | "reposts" | "signups" | "tips";

interface Bounty {
  id: string;
  brandName: string;
  brandLogo: string;
  description: string;
  metric: Metric;
  target: number;
  currentBest: number;
  rewardUSD: number;
  deadline: Date;
  status: "active" | "completed";
  contestants: number;
  tags: string[];
}

const MOCK_BOUNTIES: Bounty[] = [
  {
    id: "1",
    brandName: "Coinbase",
    brandLogo: "https://api.dicebear.com/7.x/initials/svg?seed=CB&backgroundColor=1652F0",
    description: "Create organic content explaining how to buy your first crypto. Must feel authentic, not promotional.",
    metric: "views",
    target: 500000,
    currentBest: 187000,
    rewardUSD: 5000,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "active",
    contestants: 47,
    tags: ["crypto", "education", "web3"],
  },
  {
    id: "2",
    brandName: "Farcaster",
    brandLogo: "https://api.dicebear.com/7.x/initials/svg?seed=FC&backgroundColor=8A63D2",
    description: "Get new users to sign up for Farcaster using your referral link. Most signups wins.",
    metric: "signups",
    target: 1000,
    currentBest: 342,
    rewardUSD: 3000,
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    status: "active",
    contestants: 31,
    tags: ["social", "farcaster", "growth"],
  },
  {
    id: "3",
    brandName: "Uniswap",
    brandLogo: "https://api.dicebear.com/7.x/initials/svg?seed=UNI&backgroundColor=FF007A",
    description: "Explain DeFi liquidity pools in a way a 15-year-old can understand. Most reposts wins.",
    metric: "reposts",
    target: 2000,
    currentBest: 891,
    rewardUSD: 2500,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "active",
    contestants: 22,
    tags: ["defi", "education"],
  },
  {
    id: "4",
    brandName: "LayerZero",
    brandLogo: "https://api.dicebear.com/7.x/initials/svg?seed=LZ&backgroundColor=000000",
    description: "Best breakdown of cross-chain technology for mainstream audiences.",
    metric: "tips",
    target: 500,
    currentBest: 500,
    rewardUSD: 10000,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "completed",
    contestants: 58,
    tags: ["infrastructure", "web3"],
  },
];

const METRIC_LABELS: Record<Metric, string> = {
  views: "views",
  reposts: "reposts",
  signups: "sign-ups",
  tips: "tips received",
};

function timeLeft(deadline: Date): string {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export default function BountiesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  const displayed = MOCK_BOUNTIES.filter(b =>
    activeTab === "active" ? b.status === "active" :
    activeTab === "completed" ? b.status === "completed" : false
  );

  const handleSubmit = async (bountyId: string) => {
    if (!user) { toast("warning", "Sign in to compete"); return; }
    setSubmitting(bountyId);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(null);
    setSubmitted(prev => new Set([...prev, bountyId]));
    toast("success", "Entry submitted — may the best creator win!");
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Viral Bounties" />

      {/* Hero */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-accent-amber/20 via-accent-rose/10 to-primary/20 border border-accent-amber/20 p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={18} className="text-accent-amber fill-accent-amber" />
            <span className="text-sm font-bold text-accent-amber">Performance-based brand deals</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Brands post bounties. Creators compete. Best results wins. No fake metrics, no middlemen — all verified on-chain.
          </p>
          <div className="flex gap-4 text-center">
            {[["$28,500", "In active bounties"], ["158", "Competing creators"], ["10%", "Platform fee"]].map(([val, label]) => (
              <div key={label} className="flex-1">
                <div className="text-base font-bold text-text-primary">{val}</div>
                <div className="text-[10px] text-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Post a bounty CTA */}
        <button onClick={() => setShowCreate(true)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-border hover:border-accent-amber/30 transition-all group mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-amber/15 flex items-center justify-center">
              <Plus size={16} className="text-accent-amber" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-text-primary">Post a Bounty</div>
              <div className="text-xs text-text-muted">Reach 10,000+ creators</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-text-muted group-hover:text-accent-amber transition-colors" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-1 mb-4">
        {(["active", "mine", "completed"] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
              activeTab === tab ? "bg-primary/15 text-primary-light" : "text-text-muted hover:text-text-secondary")}>
            {tab === "mine" ? "My Entries" : tab}
          </button>
        ))}
      </div>

      {/* Bounty cards */}
      <div className="px-4 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {activeTab === "mine" ? (
              <div className="text-center py-12 text-text-muted">
                <Trophy size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No entries yet</p>
                <p className="text-xs mt-1">Enter a bounty to see your submissions here</p>
              </div>
            ) : displayed.map((bounty, i) => {
              const progress = Math.min((bounty.currentBest / bounty.target) * 100, 100);
              const isSubmitted = submitted.has(bounty.id);
              return (
                <motion.div key={bounty.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }} className="card p-4">

                  {/* Brand + reward */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={bounty.brandLogo} alt={bounty.brandName} size="sm" />
                      <div>
                        <div className="text-xs text-text-muted">{bounty.brandName}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold text-accent-amber">${bounty.rewardUSD.toLocaleString()}</span>
                          <span className="text-xs text-text-muted">reward</span>
                        </div>
                      </div>
                    </div>
                    <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
                      bounty.status === "active" ? "bg-accent-green/15 text-accent-green" : "bg-text-muted/15 text-text-muted")}>
                      {bounty.status === "active" ? <><Clock size={9} /> {timeLeft(bounty.deadline)}</> : <><CheckCircle size={9} /> Ended</>}
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary mb-3 leading-relaxed">{bounty.description}</p>

                  {/* Tags */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {bounty.tags.map(t => <Badge key={t} variant="ghost">#{t}</Badge>)}
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-text-muted">Best entry: <span className="text-text-primary font-semibold">{formatCount(bounty.currentBest)} {METRIC_LABELS[bounty.metric]}</span></span>
                      <span className="text-text-muted">Goal: <span className="font-semibold">{formatCount(bounty.target)}</span></span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ delay: i * 0.06 + 0.2, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-accent-amber to-accent-rose rounded-full" />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Users size={12} /> {bounty.contestants} competing
                      <span className="mx-1">·</span>
                      <Target size={12} /> {bounty.metric}
                    </div>
                    {bounty.status === "active" && (
                      <Button variant={isSubmitted ? "secondary" : "primary"} size="sm"
                        onClick={() => handleSubmit(bounty.id)} loading={submitting === bounty.id}
                        disabled={isSubmitted} className="gap-1.5">
                        {isSubmitted ? <><CheckCircle size={12} /> Entered</> : <><Zap size={12} /> Enter</>}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create bounty sheet */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setShowCreate(false)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-text-primary mb-1">Post a Brand Bounty</h3>
              <p className="text-sm text-text-muted mb-4">Access 10,000+ verified creators. Pay only for results.</p>
              <div className="space-y-3">
                <input className="input-base" placeholder="Brand name" />
                <textarea className="input-base resize-none h-20" placeholder="What do you want creators to make?" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Reward (USD)</label>
                    <input className="input-base" type="number" placeholder="e.g. 5000" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Metric</label>
                    <select className="input-base">
                      <option>Views</option>
                      <option>Reposts</option>
                      <option>Sign-ups</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => { setShowCreate(false); toast("success", "Bounty submitted for review — we'll be in touch"); }}>
                  <TrendingUp size={13} /> Post Bounty
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
