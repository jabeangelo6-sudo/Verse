"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, DollarSign, TrendingUp, Copy, ExternalLink,
  ArrowUpRight, ArrowDownRight, Bell, Settings, ChevronRight,
  Zap, Star, BarChart2, Download, Mail
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AGENCY = {
  name: "Acme Talent",
  email: "partnerships@acmetalent.com",
  referralCode: "ACME2026",
  status: "Partner",
  joinedDate: "Jan 2026",
};

const CREATORS = [
  {
    id: "1", name: "Alex Rivera", username: "alex_builds",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera&backgroundColor=b6e3f4",
    niche: "Tech & Startups", monthlyEarnings: 3200, prevEarnings: 2800,
    followers: 48200, posts: 847, status: "active", joinedVia: "agency",
    commissionThisMonth: 32,
  },
  {
    id: "2", name: "Mia Chen", username: "mia_creates",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miachen&backgroundColor=ffd5dc",
    niche: "Art & Design", monthlyEarnings: 8400, prevEarnings: 7100,
    followers: 92100, posts: 1204, status: "active", joinedVia: "agency",
    commissionThisMonth: 84,
  },
  {
    id: "3", name: "Jordan Brooks", username: "jordan_money",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordanbrooks&backgroundColor=c0aede",
    niche: "Personal Finance", monthlyEarnings: 1800, prevEarnings: 2100,
    followers: 31500, posts: 523, status: "active", joinedVia: "agency",
    commissionThisMonth: 18,
  },
  {
    id: "4", name: "Zara Williams", username: "zara_moves",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zarawilliams&backgroundColor=d1f4e0",
    niche: "Fitness & Health", monthlyEarnings: 6200, prevEarnings: 5800,
    followers: 67800, posts: 932, status: "active", joinedVia: "agency",
    commissionThisMonth: 62,
  },
  {
    id: "5", name: "Marcus Johnson", username: "marcus_sounds",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcusjohnson&backgroundColor=ffeaa7",
    niche: "Music & Production", monthlyEarnings: 980, prevEarnings: 1200,
    followers: 24300, posts: 389, status: "active", joinedVia: "agency",
    commissionThisMonth: 9.8,
  },
];

const MONTHLY_DATA = [
  { month: "Feb", commission: 140 },
  { month: "Mar", commission: 165 },
  { month: "Apr", commission: 198 },
  { month: "May", commission: 223 },
  { month: "Jun", commission: 205.8 },
];

const PAYOUTS = [
  { date: "May 31, 2026", amount: 223.00, status: "paid", method: "PayPal" },
  { date: "Apr 30, 2026", amount: 198.00, status: "paid", method: "PayPal" },
  { date: "Mar 31, 2026", amount: 165.00, status: "paid", method: "PayPal" },
];

function StatCard({ label, value, sub, icon, trend }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; trend?: number;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">{icon}</div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 text-xs font-semibold", trend >= 0 ? "text-accent-green" : "text-accent-rose")}>
            {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        <div className="text-xs text-text-muted mt-0.5">{label}</div>
        {sub && <div className="text-xs text-text-secondary mt-1">{sub}</div>}
      </div>
    </div>
  );
}

export default function AgencyDashboardPage() {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"creators" | "payouts">("creators");

  const totalEarnings = CREATORS.reduce((s, c) => s + c.monthlyEarnings, 0);
  const totalCommission = CREATORS.reduce((s, c) => s + c.commissionThisMonth, 0);
  const prevTotalEarnings = CREATORS.reduce((s, c) => s + c.prevEarnings, 0);
  const trend = ((totalEarnings - prevTotalEarnings) / prevTotalEarnings) * 100;
  const commissionTrend = trend;

  const maxBar = Math.max(...MONTHLY_DATA.map(d => d.commission));

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://verse.app/join?agency=${AGENCY.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Nav */}
      <nav className="sticky top-0 z-40 glass-nav px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap size={14} className="text-white fill-white" />
            </div>
            <span className="text-lg font-bold font-display gradient-text">Verse</span>
          </Link>
          <span className="text-text-muted text-sm">/</span>
          <span className="text-sm font-semibold text-text-secondary">{AGENCY.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary-light text-xs font-bold flex items-center gap-1">
            <Star size={10} /> {AGENCY.status}
          </div>
          <button className="w-9 h-9 rounded-xl bg-white/[0.04] border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            <Bell size={16} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/[0.04] border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{AGENCY.name}</h1>
            <p className="text-sm text-text-muted">Partner since {AGENCY.joinedDate} · {AGENCY.email}</p>
          </div>
          <div className="card px-4 py-3 flex items-center gap-3">
            <div>
              <div className="text-xs text-text-muted mb-0.5">Your invite link</div>
              <div className="text-sm font-mono text-text-secondary">verse.app/join?agency={AGENCY.referralCode}</div>
            </div>
            <button onClick={handleCopy}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                copied ? "bg-accent-green/15 text-accent-green" : "bg-white/[0.06] text-text-secondary hover:text-text-primary")}>
              <Copy size={12} /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Active creators" value={CREATORS.length.toString()} icon={<Users size={18} className="text-accent-cyan" />} />
          <StatCard label="Creator earnings this month" value={`$${totalEarnings.toLocaleString()}`}
            sub="across all creators" icon={<TrendingUp size={18} className="text-primary-light" />} trend={trend} />
          <StatCard label="Your commission" value={`$${totalCommission.toFixed(2)}`}
            sub="10% of Verse's fees" icon={<DollarSign size={18} className="text-accent-green" />} trend={commissionTrend} />
          <StatCard label="Lifetime earned" value="$931.80"
            sub="since Jan 2026" icon={<BarChart2 size={18} className="text-accent-amber" />} />
        </div>

        {/* Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-text-primary">Monthly commission</h2>
              <p className="text-xs text-text-muted mt-0.5">Your earnings from Verse platform fees</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border text-xs text-text-muted hover:text-text-secondary transition-colors">
              <Download size={12} /> Export
            </button>
          </div>
          <div className="flex items-end gap-3 h-32">
            {MONTHLY_DATA.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="text-[10px] text-text-muted font-semibold">${d.commission}</div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.commission / maxBar) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                  className={cn("w-full rounded-t-lg min-h-[4px]",
                    i === MONTHLY_DATA.length - 1 ? "bg-gradient-to-t from-primary to-accent-cyan" : "bg-white/[0.12]")}
                />
                <div className="text-[10px] text-text-muted">{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-border w-fit">
          {(["creators", "payouts"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all",
                tab === t ? "bg-white/[0.08] text-text-primary" : "text-text-muted hover:text-text-secondary")}>
              {t}
            </button>
          ))}
        </div>

        {tab === "creators" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-primary">Your creators</h2>
              <button className="flex items-center gap-1.5 text-sm text-primary-light font-semibold hover:text-primary transition-colors">
                <Mail size={14} /> Invite creator
              </button>
            </div>
            <div className="card divide-y divide-border">
              {CREATORS.map((creator, i) => {
                const earning_trend = ((creator.monthlyEarnings - creator.prevEarnings) / creator.prevEarnings) * 100;
                return (
                  <motion.div key={creator.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <img src={creator.avatar} alt={creator.name}
                      className="w-10 h-10 rounded-xl bg-white/[0.06] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-sm">{creator.name}</span>
                        <span className="text-xs text-text-muted">@{creator.username}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-text-muted">{creator.niche}</span>
                        <span className="text-xs text-text-muted">{(creator.followers / 1000).toFixed(1)}k followers</span>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-text-primary">${creator.monthlyEarnings.toLocaleString()}</div>
                      <div className={cn("text-xs flex items-center justify-end gap-0.5 font-semibold",
                        earning_trend >= 0 ? "text-accent-green" : "text-accent-rose")}>
                        {earning_trend >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {Math.abs(earning_trend).toFixed(0)}% vs last month
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-xs text-text-muted mb-0.5">Your cut</div>
                      <div className="text-sm font-bold text-accent-green">+${creator.commissionThisMonth.toFixed(2)}</div>
                    </div>
                    <Link href={`/${creator.username}`}
                      className="w-8 h-8 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors flex-shrink-0 ml-1">
                      <ExternalLink size={13} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Invite card */}
            <div className="card p-5 border-dashed border-white/[0.08] flex flex-col sm:flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-dashed border-border flex items-center justify-center flex-shrink-0">
                <Users size={18} className="text-text-muted" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="font-semibold text-text-secondary text-sm">Add more creators</div>
                <div className="text-xs text-text-muted mt-0.5">Share your invite link or send a direct email invitation. Each new creator you bring earns you 10% commission forever.</div>
              </div>
              <button onClick={() => {
                navigator.clipboard.writeText(`https://verse.app/join?agency=${AGENCY.referralCode}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
                className="px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
                <Copy size={13} /> Copy invite link
              </button>
            </div>
          </div>
        )}

        {tab === "payouts" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-primary">Payout history</h2>
              <div className="text-xs text-text-muted">Paid monthly · min $50</div>
            </div>

            <div className="card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-text-muted mb-1">Pending payout (due Jul 31)</div>
                <div className="text-3xl font-black gradient-text">${totalCommission.toFixed(2)}</div>
                <div className="text-xs text-text-muted mt-1">from {CREATORS.length} active creators this month</div>
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-bold flex items-center gap-2 opacity-60 cursor-not-allowed" disabled>
                <DollarSign size={14} /> Payout on Jul 31
              </button>
            </div>

            <div className="card divide-y divide-border">
              {PAYOUTS.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{p.date}</div>
                    <div className="text-xs text-text-muted mt-0.5">via {p.method}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-text-primary">${p.amount.toFixed(2)}</div>
                    <div className="px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green text-xs font-semibold">
                      {p.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-text-primary text-sm mb-3">Payout method</h3>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-base">🅿️</div>
                <div className="flex-1">
                  <div className="text-sm text-text-primary font-medium">PayPal</div>
                  <div className="text-xs text-text-muted">partnerships@acmetalent.com</div>
                </div>
                <button className="text-xs text-primary-light font-semibold flex items-center gap-1 hover:text-primary transition-colors">
                  Change <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
