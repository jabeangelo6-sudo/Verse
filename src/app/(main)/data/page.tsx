"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Users, FileText, DollarSign, Shield, Check, AlertCircle, Package, Zap, Globe, Lock, ExternalLink, Mail } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { MOCK_POSTS, ME } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ExportState = "idle" | "preparing" | "done";

function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ProgressBar({ active }: { active: boolean }) {
  return (
    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mt-3">
      <motion.div
        initial={{ width: "0%" }}
        animate={active ? { width: ["0%", "60%", "100%"] } : { width: "0%" }}
        transition={{ duration: 1.4, ease: "easeInOut", times: [0, 0.6, 1] }}
        className="h-full bg-gradient-primary rounded-full"
      />
    </div>
  );
}

const MOCK_FOLLOWERS = [
  { username: "alex_k", display_name: "Alex Kim", email: "alex@example.com", followed_at: "2025-01-14", plan: "free" },
  { username: "priya_m", display_name: "Priya Mehta", email: "priya@example.com", followed_at: "2025-02-03", plan: "founding" },
  { username: "lev_p", display_name: "Lev Petrov", email: "lev@example.com", followed_at: "2025-02-18", plan: "supporter" },
  { username: "data_dao", display_name: "Data Dao", email: "datadao@example.com", followed_at: "2025-03-01", plan: "free" },
  { username: "mira_w", display_name: "Mira Walsh", email: "mira@example.com", followed_at: "2025-03-12", plan: "founding" },
  { username: "james_r", display_name: "James Reid", email: "james@example.com", followed_at: "2025-04-05", plan: "free" },
  { username: "sofia_b", display_name: "Sofia Bravo", email: "sofia@example.com", followed_at: "2025-04-22", plan: "supporter" },
  { username: "noah_t", display_name: "Noah Torres", email: "noah@example.com", followed_at: "2025-05-09", plan: "free" },
  { username: "elena_c", display_name: "Elena Cruz", email: "elena@example.com", followed_at: "2025-05-30", plan: "founding" },
  { username: "kai_d", display_name: "Kai Donnelly", email: "kai@example.com", followed_at: "2025-06-11", plan: "free" },
];

const IMPORT_PLATFORMS = [
  { name: "Beehiiv", color: "bg-[#1a1a2e]", step: "Audience → Import subscribers → Upload CSV" },
  { name: "Kit", color: "bg-[#fb6970]/20", step: "Subscribers → Import → CSV upload" },
  { name: "Substack", color: "bg-[#ff6719]/20", step: "Settings → Import → Upload your list" },
  { name: "Mailchimp", color: "bg-[#ffe01b]/20", step: "Audience → Import contacts → CSV" },
];

export default function DataPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exportStates, setExportStates] = useState<Record<string, ExportState>>({});
  const [showImportGuide, setShowImportGuide] = useState(false);

  const setExport = (key: string, state: ExportState) =>
    setExportStates(prev => ({ ...prev, [key]: state }));

  const runExport = async (key: string, fn: () => void) => {
    if (exportStates[key] === "preparing") return;
    setExport(key, "preparing");
    await new Promise(r => setTimeout(r, 1500));
    fn();
    setExport(key, "done");
    setTimeout(() => setExport(key, "idle"), 4000);
  };

  const handleExportPosts = () => runExport("posts", () => {
    const data = {
      exported_at: new Date().toISOString(),
      creator: user?.username ?? ME.username,
      posts: MOCK_POSTS.map(p => ({
        id: p.id,
        content: p.content,
        type: p.type,
        tags: p.tags,
        created_at: p.createdAt,
        likes: p.likes,
        comments: p.comments,
        tips_usd: p.tipsUSD,
        is_exclusive: p.isExclusive,
      })),
    };
    downloadJSON(`verse-posts-${new Date().toISOString().slice(0, 10)}.json`, data);
    toast("success", "Posts exported", `${MOCK_POSTS.length} posts downloaded`);
  });

  const handleExportFollowers = () => runExport("followers", () => {
    const rows = [
      ["first_name", "last_name", "email", "username", "followed_at", "plan"],
      ...MOCK_FOLLOWERS.map(f => {
        const [first, ...rest] = f.display_name.split(" ");
        return [first, rest.join(" ") || "", f.email, f.username, f.followed_at, f.plan];
      }),
    ];
    downloadCSV(`verse-followers-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    toast("success", "Follower list exported", "CSV ready to import into any newsletter platform");
  });

  const handleExportEarnings = () => runExport("earnings", () => {
    const data = {
      exported_at: new Date().toISOString(),
      creator: user?.username ?? ME.username,
      summary: { total_earned_usd: 1820.50, tips: 428.50, memberships: 892.00, licenses: 299.70, bounties: 200.30 },
      transactions: [
        { date: "2026-06-23", type: "tip_received", amount: 25.00, from: "alex_k" },
        { date: "2026-06-23", type: "membership", amount: 9.99, from: "priya_m" },
        { date: "2026-06-22", type: "tip_received", amount: 10.00, from: "data_dao" },
        { date: "2026-06-21", type: "license_fee", amount: 49.00, from: "TechCrunch" },
        { date: "2026-06-20", type: "membership", amount: 9.99, from: "lev_p" },
      ],
    };
    downloadJSON(`verse-earnings-${new Date().toISOString().slice(0, 10)}.json`, data);
    toast("success", "Earnings history exported");
  });

  const handleExportAll = () => runExport("all", () => {
    const data = {
      exported_at: new Date().toISOString(),
      format_version: "1.0",
      note: "Your complete Verse archive. You own all of this.",
      profile: {
        username: user?.username ?? ME.username,
        display_name: user?.displayName ?? ME.displayName,
        bio: user?.bio ?? ME.bio,
        followers: user?.followerCount ?? ME.followers,
        following: user?.followingCount ?? ME.following,
        total_earnings_usd: ME.earnings,
        joined_at: "2025-01-01",
      },
      posts: MOCK_POSTS.map(p => ({
        id: p.id, content: p.content, type: p.type, tags: p.tags,
        created_at: p.createdAt,
        stats: { likes: p.likes, comments: p.comments, reposts: p.reposts, tips_usd: p.tipsUSD },
      })),
      followers: MOCK_FOLLOWERS,
      earnings: {
        total_usd: 1820.50,
        by_type: { tips: 428.50, memberships: 892.00, licenses: 299.70, bounties: 200.30 },
      },
    };
    downloadJSON(`verse-full-archive-${new Date().toISOString().slice(0, 10)}.json`, data);
    toast("success", "Full archive downloaded", "Everything is yours");
  });

  const EXPORT_CARDS = [
    {
      key: "posts",
      icon: <FileText size={18} />,
      color: "text-primary-light",
      bg: "bg-primary/15 border-primary/20",
      title: "Your posts",
      desc: `${MOCK_POSTS.length} posts with full content, tags & stats`,
      format: "JSON",
      action: handleExportPosts,
    },
    {
      key: "followers",
      icon: <Users size={18} />,
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/15 border-accent-cyan/20",
      title: "Follower list",
      desc: "Names, usernames & email addresses — import-ready CSV",
      format: "CSV",
      action: handleExportFollowers,
      highlight: true,
    },
    {
      key: "earnings",
      icon: <DollarSign size={18} />,
      color: "text-accent-green",
      bg: "bg-accent-green/15 border-accent-green/20",
      title: "Earnings history",
      desc: "Every tip, membership & license fee",
      format: "JSON",
      action: handleExportEarnings,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Data & Portability" />

      <div className="px-4 pt-5 space-y-5 max-w-lg mx-auto w-full">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="card p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent-cyan/5 pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow-sm">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary mb-1">Your data. Your rules.</h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                Everything you build on Verse belongs to you. Download your content and your audience at any time. Move to any platform. No lock-in.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
            {[
              { icon: <FileText size={14} />, label: "Posts", value: String(MOCK_POSTS.length) },
              { icon: <Users size={14} />, label: "Followers", value: "1,240" },
              { icon: <DollarSign size={14} />, label: "Earned", value: "$1,820" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5">
                  {stat.icon}
                  <span className="text-[10px] uppercase tracking-wide">{stat.label}</span>
                </div>
                <div className="text-base font-bold text-text-primary">{stat.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Take your audience */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="rounded-2xl bg-accent-amber/8 border border-accent-amber/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={15} className="text-accent-amber fill-accent-amber" />
            <span className="text-sm font-bold text-accent-amber">Take your audience anywhere</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            Your follower export includes real email addresses. Import your list directly into any newsletter or email platform — you reach your audience on your terms, forever.
          </p>

          <button onClick={() => setShowImportGuide(v => !v)}
            className="text-xs text-accent-amber font-semibold flex items-center gap-1 mb-3 hover:opacity-80 transition-opacity">
            {showImportGuide ? "Hide" : "Show"} import guides <ExternalLink size={11} />
          </button>

          {showImportGuide && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 mb-3 overflow-hidden">
              {IMPORT_PLATFORMS.map(p => (
                <div key={p.name} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.06]", p.color || "bg-white/[0.04]")}>
                  <Mail size={13} className="text-text-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-text-primary">{p.name}: </span>
                    <span className="text-xs text-text-muted">{p.step}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          <div className="flex flex-wrap gap-2">
            {["Beehiiv", "Kit", "Substack", "Mailchimp", "Any email tool"].map(item => (
              <span key={item} className="text-[11px] bg-white/[0.06] border border-border px-2.5 py-1 rounded-lg text-text-secondary">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Individual exports */}
        <div>
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1 mb-3">Export by type</h2>
          <div className="space-y-2">
            {EXPORT_CARDS.map((card, i) => {
              const state = exportStates[card.key] ?? "idle";
              return (
                <motion.div key={card.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={cn("card p-4", card.highlight && "ring-1 ring-accent-cyan/25")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0", card.bg)}>
                      <span className={card.color}>{card.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-primary">{card.title}</span>
                        <span className="text-[10px] bg-white/[0.06] border border-border px-1.5 py-0.5 rounded-md text-text-muted font-mono">
                          {card.format}
                        </span>
                        {card.highlight && (
                          <span className="text-[10px] bg-accent-cyan/15 border border-accent-cyan/25 text-accent-cyan px-1.5 py-0.5 rounded-md font-semibold">
                            includes emails
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{card.desc}</p>
                      {state === "preparing" && <ProgressBar active />}
                      {state === "done" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex items-center gap-1 mt-2 text-accent-green text-xs font-medium">
                          <Check size={11} /> Downloaded — check your files
                        </motion.div>
                      )}
                    </div>
                    <button
                      onClick={card.action}
                      disabled={state === "preparing"}
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                        state === "done"
                          ? "bg-accent-green/15 text-accent-green"
                          : "bg-white/[0.06] text-text-secondary hover:bg-primary/15 hover:text-primary-light active:scale-95"
                      )}>
                      {state === "done"
                        ? <Check size={16} />
                        : <Download size={16} className={state === "preparing" ? "animate-bounce" : ""} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Full archive */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1 mb-3">Full archive</h2>
          <div className="card p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-primary-light" />
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary mb-0.5">Everything in one file</div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Profile · Posts · Followers + emails · Earnings history. One JSON you can import elsewhere or keep as a backup.
                </p>
              </div>
            </div>
            {exportStates["all"] === "preparing" && <ProgressBar active />}
            {exportStates["all"] === "done" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 mb-3 text-accent-green text-sm font-medium">
                <Check size={13} /> Archive downloaded — it&apos;s all yours
              </motion.div>
            )}
            <Button
              variant="gradient"
              size="md"
              fullWidth
              loading={exportStates["all"] === "preparing"}
              onClick={handleExportAll}
              className="gap-2">
              <Download size={15} />
              {exportStates["all"] === "done" ? "Downloaded!" : "Download full archive"}
            </Button>
            <p className="text-[11px] text-text-muted text-center mt-2">Free · Instant · Always available</p>
          </div>
        </motion.div>

        {/* Guarantees */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1 mb-3">Our commitment</h2>
          <div className="card divide-y divide-border">
            {[
              { icon: <Shield size={14} />, text: "Your data is never sold or shared with advertisers" },
              { icon: <Globe size={14} />, text: "Export anytime — no restrictions, no cooldowns, no fees" },
              { icon: <Lock size={14} />, text: "Deleting your account permanently removes all data from our servers" },
              { icon: <Users size={14} />, text: "Your followers' emails belong to you. We never contact them without your permission." },
              { icon: <Check size={14} />, text: "Full GDPR & CCPA data portability compliance" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-6 h-6 rounded-lg bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-green">{item.icon}</span>
                </div>
                <span className="text-xs text-text-secondary leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-border mb-4">
          <AlertCircle size={15} className="text-text-muted flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            Exported files contain follower email addresses. Keep them secure and never share them publicly.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
