"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp, Zap, TrendingUp, TrendingDown, CreditCard, RefreshCw, Users, DollarSign, BarChart3, CheckCircle2, AlertCircle } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatUSD, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

type EarningsTab = "overview" | "history";

const MOCK_TRANSACTIONS = [
  { id: "1", type: "tip_received", from: "alex_k", amount: 25, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "2", type: "membership", from: "priya_m", amount: 9.99, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: "3", type: "tip_received", from: "data_dao", amount: 10, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: "4", type: "license", from: "TechCrunch", amount: 49, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "5", type: "membership", from: "lev_p", amount: 9.99, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: "6", type: "tip_sent", from: "", amount: 5, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
];

const TX_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; incoming: boolean }> = {
  tip_received: { label: "Tip received", color: "text-accent-amber", icon: <Zap size={14} className="text-accent-amber fill-accent-amber" />, incoming: true },
  tip_sent: { label: "Tip sent", color: "text-text-muted", icon: <Zap size={14} className="text-text-muted" />, incoming: false },
  membership: { label: "Membership", color: "text-accent-cyan", icon: <Users size={14} className="text-accent-cyan" />, incoming: true },
  license: { label: "Content license", color: "text-accent-green", icon: <DollarSign size={14} className="text-accent-green" />, incoming: true },
};

export default function EarningsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<EarningsTab>("overview");
  const [cashingOut, setCashingOut] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [connectingStripe, setConnectingStripe] = useState(false);

  useEffect(() => {
    const stripeStatus = searchParams.get("stripe");
    if (stripeStatus === "success") {
      setStripeConnected(true);
      toast("success", "Stripe connected", "You can now receive payouts");
    } else if (stripeStatus === "error") {
      toast("warning", "Stripe connection failed", "Please try again");
    }
  }, [searchParams, toast]);

  const handleConnectStripe = async () => {
    if (!user) { toast("warning", "Sign in first"); return; }
    setConnectingStripe(true);
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email ?? "", username: user.username ?? user.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast("warning", data.error ?? "Stripe not configured yet");
      }
    } catch {
      toast("warning", "Connection failed — try again");
    } finally {
      setConnectingStripe(false);
    }
  };

  const totalEarnings = 1820.50;
  const pendingBalance = 284.50;
  const availableBalance = totalEarnings - pendingBalance;

  const handleCashOut = async () => {
    if (!user) { toast("warning", "Sign in to cash out"); return; }
    setCashingOut(true);
    await new Promise(r => setTimeout(r, 1500));
    setCashingOut(false);
    toast("success", "Withdrawal initiated", `${formatUSD(availableBalance)} on its way`);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Earnings" />

      {/* Balance hero */}
      <div className="px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/8 via-transparent to-transparent pointer-events-none" />
          <div className="text-sm text-text-muted mb-2 font-medium">Total earnings</div>
          <div className="text-4xl font-bold font-display gradient-text mb-1">{formatUSD(totalEarnings)}</div>
          {pendingBalance > 0 && (
            <div className="inline-flex items-center gap-1.5 text-xs text-accent-amber bg-accent-amber/10 border border-accent-amber/20 px-3 py-1 rounded-full mt-1">
              <RefreshCw size={10} /> {formatUSD(pendingBalance)} pending
            </div>
          )}
          <div className="flex gap-3 mt-5 justify-center">
            <Button variant="gradient" size="md" onClick={handleCashOut} loading={cashingOut} className="gap-2 flex-1 max-w-[160px]">
              <ArrowDown size={15} /> Cash out
            </Button>
            <Button variant="secondary" size="md" className="gap-2 flex-1 max-w-[160px]">
              <ArrowUp size={15} /> Send tip
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-3">
        {[
          { label: "This week", value: formatUSD(284.50), up: true, change: "+12%" },
          { label: "Members", value: "12", up: true, change: "+2" },
          { label: "All time tips", value: "94", up: true, change: "+8" },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <div className="text-lg font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
            <div className={cn("text-[10px] font-semibold flex items-center justify-center gap-0.5 mt-1", stat.up ? "text-accent-green" : "text-accent-rose")}>
              {stat.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 glass-nav border-b border-border px-4">
        <div className="flex gap-1">
          {([
            { id: "overview" as EarningsTab, label: "Overview", icon: <BarChart3 size={13} /> },
            { id: "history" as EarningsTab, label: "History", icon: <RefreshCw size={13} /> },
          ]).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-all relative",
                activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary")}>
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="earnings-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {MOCK_TRANSACTIONS.map((tx, i) => {
                const cfg = TX_CONFIG[tx.type] ?? TX_CONFIG.tip_received;
                return (
                  <motion.div key={tx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary">{cfg.label}</div>
                      <div className="text-xs text-text-muted">
                        {tx.from ? `from @${tx.from}` : "sent"} · {timeAgo(tx.createdAt)}
                      </div>
                    </div>
                    <div className={cn("text-sm font-bold", cfg.incoming ? "text-accent-green" : "text-text-secondary")}>
                      {cfg.incoming ? "+" : "-"}{formatUSD(tx.amount)}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Revenue breakdown */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Revenue breakdown</h3>
                {[
                  { label: "Tips", amount: 428.50, percent: 24, color: "bg-accent-amber" },
                  { label: "Memberships", amount: 892.00, percent: 49, color: "bg-primary-light" },
                  { label: "Content licenses", amount: 299.70, percent: 16, color: "bg-accent-cyan" },
                  { label: "Bounty winnings", amount: 200.30, percent: 11, color: "bg-accent-green" },
                ].map((item) => (
                  <div key={item.label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-secondary">{item.label}</span>
                      <span className="font-semibold text-text-primary">{formatUSD(item.amount)}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.percent}%` }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                        className={cn("h-full rounded-full", item.color)} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stripe Connect */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <CreditCard size={14} className="text-accent-cyan" /> Payout account
                </h3>
                {stripeConnected ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-accent-green/8 border border-accent-green/20">
                    <CheckCircle2 size={18} className="text-accent-green flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Stripe connected</div>
                      <div className="text-xs text-text-muted">Bank transfers in 2–3 business days</div>
                    </div>
                    <Button variant="secondary" size="sm" className="ml-auto" onClick={handleCashOut} loading={cashingOut}>
                      Cash out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-amber/8 border border-accent-amber/20">
                      <AlertCircle size={16} className="text-accent-amber flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-text-secondary leading-relaxed">
                        Connect Stripe to receive tips, membership payments, and license fees directly to your bank account.
                      </div>
                    </div>
                    <Button variant="gradient" size="md" className="w-full gap-2" onClick={handleConnectStripe} loading={connectingStripe}>
                      <CreditCard size={14} /> Connect Stripe account
                    </Button>
                    <p className="text-[11px] text-text-muted text-center">
                      Verse keeps 10% · You keep 90% · Payouts every 7 days
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
