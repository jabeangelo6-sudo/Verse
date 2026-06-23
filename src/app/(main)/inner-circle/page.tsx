"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Crown, Users, Lock, Zap, MessageCircle, BadgeCheck, ChevronRight, Sparkles, TrendingUp, Heart, Copy, Check, ExternalLink } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatUSD } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "fans" | "circle";

const MOCK_SUPER_FANS = [
  { id: "1", username: "alex_k", displayName: "Alex Kim", engagementScore: 98, postsRead: 147, followingSince: "8 months", inCircle: false },
  { id: "2", username: "priya_m", displayName: "Priya Mehta", engagementScore: 94, postsRead: 132, followingSince: "6 months", inCircle: true },
  { id: "3", username: "data_dao", displayName: "DataDAO", engagementScore: 91, postsRead: 118, followingSince: "1 year", inCircle: true },
  { id: "4", username: "lev_p", displayName: "Lev Petrov", engagementScore: 87, postsRead: 104, followingSince: "5 months", inCircle: false },
  { id: "5", username: "maya_c", displayName: "Maya Chen", engagementScore: 85, postsRead: 98, followingSince: "4 months", inCircle: false },
  { id: "6", username: "james_r", displayName: "James Rivera", engagementScore: 82, postsRead: 91, followingSince: "7 months", inCircle: true },
  { id: "7", username: "sol_b", displayName: "Sol Bautista", engagementScore: 79, postsRead: 84, followingSince: "3 months", inCircle: false },
  { id: "8", username: "nia_w", displayName: "Nia Walker", engagementScore: 76, postsRead: 77, followingSince: "5 months", inCircle: false },
];

const CIRCLE_BENEFITS = [
  { icon: <MessageCircle size={14} className="text-primary-light" />, label: "Direct message access" },
  { icon: <Zap size={14} className="text-accent-amber fill-accent-amber" />, label: "Posts 24h before everyone else" },
  { icon: <Star size={14} className="text-accent-cyan fill-accent-cyan" />, label: "Permanent 'Day One' badge" },
  { icon: <Crown size={14} className="text-accent-amber" />, label: "Founding member wall recognition" },
];

export default function InnerCirclePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("fans");
  const [fans, setFans] = useState(MOCK_SUPER_FANS);
  const [circleActive, setCircleActive] = useState(false);
  const [monthlyPrice, setMonthlyPrice] = useState(19);
  const [maxMembers, setMaxMembers] = useState(100);
  const [showSetup, setShowSetup] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const circleMembers = fans.filter(f => f.inCircle);
  const monthlyRevenue = circleMembers.length * monthlyPrice;

  const handleInvite = async (fanId: string) => {
    if (!user) { toast("warning", "Sign in to invite fans"); return; }
    setInviting(fanId);
    await new Promise(r => setTimeout(r, 1000));
    setFans(prev => prev.map(f => f.id === fanId ? { ...f, inCircle: true } : f));
    setInviting(null);
    const fan = fans.find(f => f.id === fanId);
    toast("success", `Invited ${fan?.displayName}`, "They'll get a personal notification");
  };

  const handleSetupCircle = async () => {
    await new Promise(r => setTimeout(r, 800));
    setCircleActive(true);
    setShowSetup(false);
    toast("success", "Inner Circle is live", `$${monthlyPrice}/mo · ${maxMembers} spots`);
  };

  const membershipUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${user?.username ?? "you"}/membership`
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(membershipUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast("success", "Link copied", "Share it with your audience");
  };

  const scoreColor = (score: number) => {
    if (score >= 90) return "text-accent-amber";
    if (score >= 80) return "text-primary-light";
    return "text-accent-cyan";
  };

  const scoreLabel = (score: number) => {
    if (score >= 90) return "Super fan";
    if (score >= 80) return "Top fan";
    return "Loyal fan";
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Inner Circle" />

      {/* Hero */}
      <div className="px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="card p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-accent-amber/8 via-transparent to-transparent pointer-events-none" />

          {circleActive ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={16} className="text-accent-amber" />
                  <span className="text-sm font-semibold text-text-primary">Your Inner Circle</span>
                  <span className="text-[10px] bg-accent-green/15 text-accent-green border border-accent-green/20 px-1.5 py-0.5 rounded-full font-bold">Active</span>
                </div>
                <div className="text-3xl font-bold gradient-text">{formatUSD(monthlyRevenue)}<span className="text-base text-text-muted font-normal">/mo</span></div>
                <div className="text-xs text-text-muted mt-0.5">{circleMembers.length} members · {maxMembers - circleMembers.length} spots left</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs font-semibold text-accent-amber">${monthlyPrice}/mo</div>
                <div className="flex -space-x-2">
                  {circleMembers.slice(0, 4).map((m) => (
                    <Avatar key={m.id} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`} alt={m.displayName} size="xs"
                      className="ring-2 ring-bg-base" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-accent-amber/15 flex items-center justify-center mx-auto mb-3">
                <Crown size={22} className="text-accent-amber" />
              </div>
              <div className="text-base font-bold text-text-primary mb-1">Your Inner Circle</div>
              <div className="text-sm text-text-muted mb-4">
                Verse found <span className="text-accent-amber font-semibold">{fans.filter(f => f.engagementScore >= 80).length} super fans</span> in your audience. Invite them to a private paid tier.
              </div>
              <Button variant="gradient" size="sm" onClick={() => setShowSetup(true)} className="gap-2">
                <Sparkles size={13} /> Set up Inner Circle
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Stats row */}
      {circleActive && (
        <div className="px-4 pb-4 grid grid-cols-3 gap-3">
          {[
            { label: "Members", value: circleMembers.length, icon: <Users size={13} className="text-primary-light" /> },
            { label: "Monthly rev", value: formatUSD(monthlyRevenue), icon: <TrendingUp size={13} className="text-accent-green" /> },
            { label: "Spots left", value: maxMembers - circleMembers.length, icon: <Star size={13} className="text-accent-amber" /> },
          ].map((s) => (
            <div key={s.label} className="card p-3 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <div className="text-base font-bold text-text-primary">{s.value}</div>
              <div className="text-[10px] text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Share membership link */}
      {circleActive && (
        <div className="px-4 pb-4">
          <div className="card p-4">
            <div className="text-xs font-semibold text-text-secondary mb-2">Your membership page</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-[11px] text-text-muted bg-white/[0.04] px-3 py-2 rounded-lg truncate font-mono">
                {membershipUrl}
              </code>
              <button onClick={handleCopyLink}
                className="p-2 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text-secondary transition-colors flex-shrink-0">
                {linkCopied ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
              </button>
              <a href={membershipUrl} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text-secondary transition-colors flex-shrink-0">
                <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-[10px] text-text-muted mt-2">
              Verse keeps 10% · You keep <span className="text-accent-green font-semibold">{formatUSD(monthlyRevenue * 0.9)}/mo</span> after fees
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="sticky top-14 z-20 glass-nav border-b border-border px-4">
        <div className="flex gap-1">
          {([
            { id: "fans" as Tab, label: "Your Top Fans", icon: <Heart size={13} /> },
            { id: "circle" as Tab, label: "Inner Circle", icon: <Crown size={13} /> },
          ]).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-all relative",
                activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary")}>
              {tab.icon} {tab.label}
              {tab.id === "circle" && circleMembers.length > 0 && (
                <span className="ml-1 text-[10px] bg-accent-amber/20 text-accent-amber px-1.5 py-0.5 rounded-full font-bold">
                  {circleMembers.length}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div layoutId="circle-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">

          {/* Top Fans tab */}
          {activeTab === "fans" && (
            <motion.div key="fans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <p className="text-xs text-text-muted mb-3 flex items-center gap-1.5">
                <Sparkles size={11} className="text-primary-light" />
                Ranked by how deeply they engage with your content
              </p>
              {fans.map((fan, i) => (
                <motion.div key={fan.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-xl card">
                  <span className="text-sm font-bold text-text-muted w-5 text-center flex-shrink-0">{i + 1}</span>
                  <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fan.username}`} alt={fan.displayName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-text-primary">{fan.displayName}</span>
                      {fan.inCircle && <BadgeCheck size={13} className="text-accent-amber flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-text-muted">@{fan.username} · {fan.followingSince}</div>
                  </div>
                  <div className="text-right flex-shrink-0 mr-2">
                    <div className={cn("text-sm font-bold", scoreColor(fan.engagementScore))}>{fan.engagementScore}</div>
                    <div className="text-[10px] text-text-muted">{scoreLabel(fan.engagementScore)}</div>
                  </div>
                  {fan.inCircle ? (
                    <span className="text-[10px] bg-accent-amber/15 text-accent-amber border border-accent-amber/20 px-2 py-1 rounded-lg font-semibold flex-shrink-0">
                      Member
                    </span>
                  ) : (
                    <Button variant="secondary" size="sm"
                      loading={inviting === fan.id}
                      onClick={() => handleInvite(fan.id)}
                      className="flex-shrink-0 text-xs">
                      Invite
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Inner Circle tab */}
          {activeTab === "circle" && (
            <motion.div key="circle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

              {/* Benefits */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Crown size={14} className="text-accent-amber" /> Member benefits
                </h3>
                <div className="space-y-2.5">
                  {CIRCLE_BENEFITS.map((b) => (
                    <div key={b.label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                        {b.icon}
                      </div>
                      <span className="text-sm text-text-secondary">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current members */}
              {circleMembers.length > 0 ? (
                <div className="card p-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">
                    Founding members · {circleMembers.length}
                  </h3>
                  <div className="space-y-2">
                    {circleMembers.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                        <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`} alt={m.displayName} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text-primary flex items-center gap-1">
                            {m.displayName}
                            <BadgeCheck size={12} className="text-accent-amber" />
                          </div>
                          <div className="text-xs text-text-muted">@{m.username}</div>
                        </div>
                        <div className="text-xs font-semibold text-accent-green">+{formatUSD(monthlyPrice)}/mo</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card p-6 text-center">
                  <Crown size={28} className="text-text-muted mx-auto mb-3" />
                  <div className="text-sm text-text-muted">No members yet</div>
                  <div className="text-xs text-text-muted mt-1">Invite your top fans from the Fans tab</div>
                </div>
              )}

              {/* Invite more CTA */}
              <button onClick={() => setActiveTab("fans")}
                className="w-full flex items-center justify-between p-4 card hover:border-border-strong transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users size={16} className="text-primary-light" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-text-primary">Invite more fans</div>
                    <div className="text-xs text-text-muted">{fans.filter(f => !f.inCircle).length} eligible fans waiting</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-muted" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Setup modal */}
      <AnimatePresence>
        {showSetup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="glass border border-border rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Crown size={16} className="text-accent-amber" /> Set up Inner Circle
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">Invite-only premium membership</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Tier presets */}
                <div>
                  <label className="text-xs font-semibold text-text-secondary mb-2 block">Choose a tier</label>
                  <div className="space-y-2">
                    {[
                      { price: 9, label: "Entry", desc: "Early access + DMs", color: "border-primary/30 bg-primary/8 text-primary-light" },
                      { price: 19, label: "Core", desc: "+ Founding member badge", color: "border-accent-amber/30 bg-accent-amber/8 text-accent-amber" },
                      { price: 49, label: "Premium", desc: "+ Monthly 1-on-1 call", color: "border-accent-cyan/30 bg-accent-cyan/8 text-accent-cyan" },
                    ].map(tier => (
                      <button key={tier.price} onClick={() => setMonthlyPrice(tier.price)}
                        className={cn("w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left",
                          monthlyPrice === tier.price ? tier.color : "border-border bg-white/[0.02] text-text-secondary hover:border-border-strong")}>
                        <div>
                          <span className="text-sm font-bold">{tier.label}</span>
                          <span className="text-xs text-text-muted ml-2">{tier.desc}</span>
                        </div>
                        <span className="text-sm font-bold">${tier.price}/mo</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary mb-2 block">Max members (creates scarcity)</label>
                  <div className="flex gap-2">
                    {[25, 50, 100, 250].map(m => (
                      <button key={m} onClick={() => setMaxMembers(m)}
                        className={cn("flex-1 py-2 rounded-xl text-sm font-bold border transition-all",
                          maxMembers === m
                            ? "bg-primary/15 text-primary-light border-primary/25"
                            : "bg-white/[0.04] text-text-secondary border-border hover:border-border-strong")}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-accent-green/8 border border-accent-green/15">
                  <div className="text-xs text-text-muted">If all {maxMembers} spots fill</div>
                  <div className="text-lg font-bold text-accent-green">{formatUSD(maxMembers * monthlyPrice)}<span className="text-sm font-normal text-text-muted">/mo</span></div>
                </div>

                <Button variant="gradient" size="md" className="w-full gap-2" onClick={handleSetupCircle}>
                  <Crown size={14} /> Launch Inner Circle
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
