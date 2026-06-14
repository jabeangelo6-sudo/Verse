"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp, Zap, TrendingUp, TrendingDown, Copy, ExternalLink, CreditCard, Wallet, RefreshCw } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Button } from "@/components/ui/Button";
import { useWallet } from "@/lib/hooks/useWallet";
import { useToast } from "@/components/ui/Toast";
import { formatUSD, timeAgo, truncateAddress } from "@/lib/utils";
import { ME } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type WalletTab = "overview" | "transactions" | "tokens";

const TX_ICONS: Record<string, React.ReactNode> = {
  tip_received: <Zap size={14} className="text-accent-amber fill-accent-amber" />,
  tip_sent: <Zap size={14} className="text-text-muted" />,
  token_sale: <TrendingUp size={14} className="text-accent-green" />,
  nft_sale: <TrendingUp size={14} className="text-primary-light" />,
  subscription: <RefreshCw size={14} className="text-accent-cyan" />,
};

const TX_LABELS: Record<string, string> = {
  tip_received: "Tip received",
  tip_sent: "Tip sent",
  token_sale: "Token sale",
  nft_sale: "NFT sale",
  subscription: "Subscription",
};

export default function WalletPage() {
  const { balance, ethBalance, pendingBalance, transactions, cashOut } = useWallet();
  const [activeTab, setActiveTab] = useState<WalletTab>("overview");
  const [cashingOut, setCashingOut] = useState(false);
  const { toast } = useToast();

  const handleCashOut = async () => {
    setCashingOut(true);
    await cashOut(balance);
    setCashingOut(false);
    toast("success", "Withdrawal initiated", `${formatUSD(balance)}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ME.walletAddress);
    toast("success", "Address copied");
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Wallet" />

      {/* Balance hero */}
      <div className="px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-radial from-primary/8 via-transparent to-transparent pointer-events-none" />

          <div className="text-sm text-text-muted mb-2 font-medium">Total earnings</div>
          <div className="text-4xl font-bold font-display gradient-text mb-1">
            {formatUSD(balance)}
          </div>
          <div className="text-sm text-text-muted mb-1">
            {ethBalance.toFixed(4)} ETH
          </div>
          {pendingBalance > 0 && (
            <div className="inline-flex items-center gap-1.5 text-xs text-accent-amber bg-accent-amber/10 border border-accent-amber/20 px-3 py-1 rounded-full mt-1">
              <RefreshCw size={10} />
              {formatUSD(pendingBalance)} pending
            </div>
          )}

          <div className="flex gap-3 mt-5 justify-center">
            <Button variant="gradient" size="md" onClick={handleCashOut} loading={cashingOut} className="gap-2 flex-1 max-w-[160px]">
              <ArrowDown size={15} /> Cash out
            </Button>
            <Button variant="secondary" size="md" className="gap-2 flex-1 max-w-[160px]">
              <ArrowUp size={15} /> Send
            </Button>
          </div>
        </motion.div>

        {/* Wallet address */}
        <div className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-border">
          <div>
            <div className="text-xs text-text-muted mb-0.5">Wallet address</div>
            <div className="text-sm font-mono text-text-secondary">{truncateAddress(ME.walletAddress)}</div>
          </div>
          <div className="flex gap-1">
            <button onClick={handleCopy} className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors">
              <Copy size={14} />
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors">
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-3">
        {[
          { label: "This week", value: formatUSD(284.50), up: true },
          { label: "Subscribers", value: "12", up: true },
          { label: "Token holders", value: "48", up: false },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <div className="text-lg font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
            <div className={cn("text-[10px] font-semibold flex items-center justify-center gap-0.5 mt-1", stat.up ? "text-accent-green" : "text-accent-rose")}>
              {stat.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {stat.up ? "+12%" : "-3%"}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 glass-nav border-b border-border px-4">
        <div className="flex gap-1">
          {([
            { id: "overview" as WalletTab, label: "Overview", icon: <Wallet size={13} /> },
            { id: "transactions" as WalletTab, label: "History", icon: <RefreshCw size={13} /> },
            { id: "tokens" as WalletTab, label: "Tokens", icon: <TrendingUp size={13} /> },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-all relative",
                activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
              )}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="wallet-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === "transactions" && (
            <motion.div key="txns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {transactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                    {TX_ICONS[tx.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary">{TX_LABELS[tx.type]}</div>
                    <div className="text-xs text-text-muted">{tx.from ? `from @${tx.from}` : ""} · {timeAgo(tx.createdAt)}</div>
                  </div>
                  <div className={cn("text-sm font-bold", tx.type.includes("received") || tx.type === "token_sale" || tx.type === "nft_sale" || tx.type === "subscription" ? "text-accent-green" : "text-text-secondary")}>
                    {tx.type === "tip_sent" ? "-" : "+"}{formatUSD(tx.amount)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Revenue breakdown */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Revenue breakdown</h3>
                {[
                  { label: "Tips", amount: 428.50, percent: 24, color: "bg-accent-amber" },
                  { label: "Token sales", amount: 892.00, percent: 49, color: "bg-primary-light" },
                  { label: "Subscriptions", amount: 299.70, percent: 16, color: "bg-accent-cyan" },
                  { label: "NFT sales", amount: 200.30, percent: 11, color: "bg-accent-green" },
                ].map((item) => (
                  <div key={item.label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-secondary">{item.label}</span>
                      <span className="font-semibold text-text-primary">{formatUSD(item.amount)}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                        className={cn("h-full rounded-full", item.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Cashout options */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Cashout options</h3>
                <div className="space-y-2">
                  {[
                    { icon: <CreditCard size={16} />, label: "Bank transfer", subtitle: "2-3 business days", badge: "Recommended" },
                    { icon: <Wallet size={16} />, label: "Crypto wallet", subtitle: "Instant", badge: null },
                  ].map((opt) => (
                    <button key={opt.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] border border-border hover:border-border-strong transition-all text-left">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-text-secondary flex-shrink-0">
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary flex items-center gap-2">
                          {opt.label}
                          {opt.badge && <span className="text-[10px] bg-accent-green/15 text-accent-green border border-accent-green/20 px-1.5 py-0.5 rounded-full font-semibold">{opt.badge}</span>}
                        </div>
                        <div className="text-xs text-text-muted">{opt.subtitle}</div>
                      </div>
                      <ArrowUp size={14} className="text-text-muted rotate-90" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "tokens" && (
            <motion.div key="tokens" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Zap size={16} className="text-white fill-white" />
                  </div>
                  <div>
                    <div className="font-bold text-text-primary">{ME.tokenSymbol}</div>
                    <div className="text-xs text-text-muted">Your creator token</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-bold text-text-primary">${ME.tokenPrice}</div>
                    <div className="text-xs text-accent-green flex items-center gap-0.5 justify-end">
                      <TrendingUp size={10} /> +{ME.tokenChange}%
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white/[0.03] p-2.5">
                    <div className="text-text-muted text-xs mb-0.5">Circulating</div>
                    <div className="font-bold text-text-primary">10,000</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2.5">
                    <div className="text-text-muted text-xs mb-0.5">Holders</div>
                    <div className="font-bold text-text-primary">48</div>
                  </div>
                </div>
              </div>

              <div className="text-center py-8 text-text-muted text-sm">
                <TrendingUp size={24} className="mx-auto mb-2 opacity-30" />
                No other tokens held
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
