"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, Users, DollarSign, Clock, BarChart3, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PostDerivative {
  id: string;
  postSnippet: string;
  creator: { username: string; displayName: string; avatar: string };
  currentViews: number;
  projectedViews: number;
  currentPrice: number;
  priceChange: number;
  holders: number;
  availableShares: number;
  totalShares: number;
  potentialUpside: number;
  hoursOld: number;
  momentum: "rising" | "falling" | "steady";
}

const MOCK_DERIVATIVES: PostDerivative[] = [
  {
    id: "1",
    postSnippet: "The internet is about to bifurcate into two webs: the AI web and the human web. Which one you live in will determine your earning power for the next decade.",
    creator: { username: "future_lens", displayName: "Maya Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya" },
    currentViews: 48000,
    projectedViews: 800000,
    currentPrice: 4.20,
    priceChange: 142,
    holders: 34,
    availableShares: 180,
    totalShares: 1000,
    potentialUpside: 16.6,
    hoursOld: 3,
    momentum: "rising",
  },
  {
    id: "2",
    postSnippet: "I analyzed 10,000 creator accounts. The ones making real money all have one thing in common — and it's not talent.",
    creator: { username: "data_dao", displayName: "Lev Petrov", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lev" },
    currentViews: 230000,
    projectedViews: 1200000,
    currentPrice: 12.80,
    priceChange: 89,
    holders: 71,
    availableShares: 42,
    totalShares: 1000,
    potentialUpside: 5.2,
    hoursOld: 9,
    momentum: "rising",
  },
  {
    id: "3",
    postSnippet: "Hot take: NFTs weren't a bubble. The execution was wrong but the idea — digital ownership — is one of the most important ideas of the century.",
    creator: { username: "contrarian_k", displayName: "Kenji Mori", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kenji" },
    currentViews: 92000,
    projectedViews: 300000,
    currentPrice: 2.10,
    priceChange: -12,
    holders: 28,
    availableShares: 620,
    totalShares: 1000,
    potentialUpside: 3.2,
    hoursOld: 16,
    momentum: "falling",
  },
];

interface Portfolio {
  postId: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  postSnippet: string;
}

export default function DerivativesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"market" | "portfolio">("market");
  const [selected, setSelected] = useState<PostDerivative | null>(null);
  const [buyAmount, setBuyAmount] = useState(1);
  const [buying, setBuying] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);

  const handleBuy = async () => {
    if (!user) { toast("warning", "Sign in to buy stakes"); return; }
    if (!selected) return;
    setBuying(true);
    await new Promise(r => setTimeout(r, 1400));
    setBuying(false);
    const cost = (selected.currentPrice * buyAmount).toFixed(2);
    setPortfolio(prev => {
      const existing = prev.find(p => p.postId === selected.id);
      if (existing) {
        return prev.map(p => p.postId === selected.id
          ? { ...p, shares: p.shares + buyAmount, avgPrice: (p.avgPrice * p.shares + selected.currentPrice * buyAmount) / (p.shares + buyAmount) }
          : p);
      }
      return [...prev, { postId: selected.id, shares: buyAmount, avgPrice: selected.currentPrice, currentPrice: selected.currentPrice, postSnippet: selected.postSnippet }];
    });
    toast("success", `Bought ${buyAmount} share${buyAmount > 1 ? "s" : ""} for $${cost} — you earn if this goes viral`);
    setSelected(null);
    setBuyAmount(1);
  };

  const portfolioValue = portfolio.reduce((sum, p) => sum + p.shares * p.currentPrice, 0);
  const portfolioCost = portfolio.reduce((sum, p) => sum + p.shares * p.avgPrice, 0);

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Content Futures" />

      {/* Hero */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-accent-green/20 via-accent-cyan/10 to-primary/10 border border-accent-green/20 p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={16} className="text-accent-green" />
            <span className="text-sm font-bold text-accent-green">Buy into posts before they go viral</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Early believers buy a stake in a post's future earnings. If it blows up, you earn proportionally. New asset class — built on content.
          </p>
          <div className="flex gap-4">
            {[["$142K", "Volume today"], ["2.4x", "Avg return"], ["3hrs", "Sweet spot entry"]].map(([val, label]) => (
              <div key={label} className="flex-1 text-center">
                <div className="text-base font-bold text-text-primary">{val}</div>
                <div className="text-[10px] text-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-1 mb-4">
        {(["market", "portfolio"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
              tab === t ? "bg-accent-green/15 text-accent-green" : "text-text-muted hover:text-text-secondary")}>
            {t === "portfolio" ? `My Portfolio ${portfolio.length > 0 ? `(${portfolio.length})` : ""}` : "Market"}
          </button>
        ))}
      </div>

      {tab === "market" ? (
        <div className="px-4 space-y-3">
          {MOCK_DERIVATIVES.map((deriv, i) => (
            <motion.div key={deriv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} className="card p-4">

              <div className="flex items-center gap-2.5 mb-2.5">
                <Avatar src={deriv.creator.avatar} alt={deriv.creator.displayName} size="sm" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-text-primary">{deriv.creator.displayName}</span>
                  <span className="text-xs text-text-muted ml-1">· {deriv.hoursOld}h ago</span>
                </div>
                <div className={cn("flex items-center gap-1 text-xs font-bold",
                  deriv.priceChange >= 0 ? "text-accent-green" : "text-accent-rose")}>
                  {deriv.priceChange >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(deriv.priceChange)}%
                </div>
              </div>

              <p className="text-sm text-text-secondary italic mb-3 leading-relaxed line-clamp-2">"{deriv.postSnippet}"</p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center bg-white/[0.03] rounded-lg p-2">
                  <div className="text-xs font-bold text-text-primary">{formatCount(deriv.currentViews)}</div>
                  <div className="text-[10px] text-text-muted">Current views</div>
                </div>
                <div className="text-center bg-accent-green/5 rounded-lg p-2 border border-accent-green/10">
                  <div className="text-xs font-bold text-accent-green">{formatCount(deriv.projectedViews)}</div>
                  <div className="text-[10px] text-text-muted">Projected</div>
                </div>
                <div className="text-center bg-white/[0.03] rounded-lg p-2">
                  <div className="text-xs font-bold text-text-primary">{deriv.potentialUpside}x</div>
                  <div className="text-[10px] text-text-muted">Max upside</div>
                </div>
              </div>

              {/* Share availability */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-text-muted mb-1">
                  <span><Users size={9} className="inline" /> {deriv.holders} holders</span>
                  <span>{deriv.availableShares} of {deriv.totalShares} shares left</span>
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-accent-green rounded-full"
                    style={{ width: `${((deriv.totalShares - deriv.availableShares) / deriv.totalShares) * 100}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-text-primary">${deriv.currentPrice.toFixed(2)}</span>
                  <span className="text-xs text-text-muted ml-1">/ share</span>
                </div>
                <Button variant="primary" size="sm" onClick={() => setSelected(deriv)} className="gap-1.5">
                  <TrendingUp size={12} /> Buy Stake
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="px-4">
          {portfolio.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <BarChart3 size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No stakes yet</p>
              <p className="text-xs mt-1">Buy into posts on the Market tab</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="card p-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-text-muted">Portfolio value</span>
                  <span className={cn("text-sm font-bold", portfolioValue >= portfolioCost ? "text-accent-green" : "text-accent-rose")}>
                    ${portfolioValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-muted">P&L</span>
                  <span className={cn("text-xs font-semibold", portfolioValue >= portfolioCost ? "text-accent-green" : "text-accent-rose")}>
                    {portfolioValue >= portfolioCost ? "+" : ""}${(portfolioValue - portfolioCost).toFixed(2)}
                  </span>
                </div>
              </div>
              {portfolio.map(p => (
                <div key={p.postId} className="card p-4">
                  <p className="text-xs text-text-secondary italic mb-2 line-clamp-2">"{p.postSnippet}"</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">{p.shares} shares @ ${p.avgPrice.toFixed(2)}</span>
                    <span className="text-text-primary font-semibold">${(p.shares * p.currentPrice).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buy modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full md:max-w-md bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold text-text-primary mb-1">Buy a stake</h3>
              <p className="text-xs text-text-muted italic mb-4 line-clamp-2">"{selected.postSnippet}"</p>

              <div className="bg-white/[0.03] rounded-xl p-3 mb-4 text-xs space-y-2">
                <div className="flex justify-between"><span className="text-text-muted">Share price</span><span className="font-semibold">${selected.currentPrice.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Projected views</span><span className="text-accent-green font-semibold">{formatCount(selected.projectedViews)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Max upside</span><span className="text-accent-green font-semibold">{selected.potentialUpside}x</span></div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-text-muted mb-2 block">Number of shares</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setBuyAmount(Math.max(1, buyAmount - 1))}
                    className="w-9 h-9 rounded-xl bg-white/[0.06] text-lg font-bold text-text-primary hover:bg-white/[0.1] transition-colors">−</button>
                  <span className="flex-1 text-center text-2xl font-bold text-text-primary">{buyAmount}</span>
                  <button onClick={() => setBuyAmount(Math.min(50, buyAmount + 1))}
                    className="w-9 h-9 rounded-xl bg-white/[0.06] text-lg font-bold text-text-primary hover:bg-white/[0.1] transition-colors">+</button>
                </div>
                <div className="text-center text-sm text-text-muted mt-2">
                  Total: <span className="text-text-primary font-bold">${(selected.currentPrice * buyAmount).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-accent-amber/5 rounded-xl p-3 mb-4 text-xs text-text-muted">
                <Info size={12} className="text-accent-amber flex-shrink-0 mt-0.5" />
                If this post's earnings exceed projections, your shares appreciate. You earn when creators earn.
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelected(null)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1 gap-1.5" loading={buying} onClick={handleBuy}>
                  <DollarSign size={13} /> Buy ${(selected.currentPrice * buyAmount).toFixed(2)}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
