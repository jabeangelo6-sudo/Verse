"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BadgeCheck, Share2, MoreHorizontal, Grid3x3, FileText, Lock, Users, Link2, Target, Star, Zap, X, Copy, Check } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Popover } from "@/components/ui/Popover";
import { FeedPost } from "@/components/feed/FeedPost";
import { EarlyBelieverBadge } from "@/components/features/EarlyBelieverBadge";
import { ExpertBadge } from "@/components/features/ExpertBadge";
import { useToast } from "@/components/ui/Toast";
import { MOCK_CREATORS, MOCK_POSTS } from "@/lib/mock-data";
import { formatCount, formatUSD } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProfileTab = "posts" | "members" | "media";

export default function CreatorProfilePage({ params }: { params: { username: string } }) {
  const creator = MOCK_CREATORS.find(c => c.username === params.username) ?? MOCK_CREATORS[0];
  const creatorPosts = MOCK_POSTS.filter(p => p.creator.username === creator.username);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(creator.followers);
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [showTip, setShowTip] = useState(false);
  const [tipping, setTipping] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const { toast } = useToast();

  const userFollowedAt = Math.floor(creator.followers * 0.012);
  const isEarlyBeliever = userFollowedAt < creator.earlyBelieverThreshold;

  const handleFollow = () => {
    setFollowing(v => !v);
    setFollowerCount(n => following ? n - 1 : n + 1);
    if (!following) toast("success", `Following ${creator.displayName}`);
  };

  const handleTip = async (amount: number) => {
    setTipping(true);
    await new Promise(r => setTimeout(r, 1200));
    setTipping(false);
    setShowTip(false);
    toast("tip", `Tipped ${creator.displayName}`, `$${amount}`);
  };

  const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/${creator.username}` : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
    toast("success", "Link copied");
  };

  const handleShareTwitter = () => {
    const text = `Check out @${creator.username} on Verse — ${creator.bio.slice(0, 100)}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`, "_blank");
    setShowShare(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-nav px-4 h-14 flex items-center justify-between md:hidden">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-secondary">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-semibold text-text-primary">@{creator.username}</span>
        <div className="flex gap-1">
          <div className="relative">
            <button onClick={() => setShowShare(v => !v)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-secondary">
              <Share2 size={18} />
            </button>
            <Popover open={showShare} onClose={() => setShowShare(false)}
              anchor="top-right" className="glass border border-border rounded-2xl p-3 shadow-card-hover min-w-[180px] space-y-1">
              <button onClick={handleShareTwitter} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-xs text-text-secondary hover:text-text-primary transition-colors">
                <span className="font-black text-[11px]">𝕏</span> Share on X
              </button>
              <button onClick={handleCopyLink} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-xs text-text-secondary hover:text-text-primary transition-colors">
                {shareCopied ? <Check size={13} className="text-accent-green" /> : <Copy size={13} />}
                {shareCopied ? "Copied!" : "Copy link"}
              </button>
            </Popover>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className={cn("h-36 bg-gradient-to-br relative", creator.coverGradient)}>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/60 to-transparent" />
      </div>

      <div className="px-4 pb-4 -mt-10 relative">
        <div className="flex items-end justify-between mb-4">
          <Avatar src={creator.avatar} alt={creator.displayName} size="xl" ring={creator.verified} />
          <div className="flex gap-2 mb-1">
            {/* Tip button */}
            <div className="relative">
              <Button variant="secondary" size="sm" onClick={() => setShowTip(v => !v)} className="gap-1.5">
                <Zap size={13} className="text-accent-amber fill-accent-amber" /> Tip
              </Button>
              <Popover open={showTip} onClose={() => setShowTip(false)}
                anchor="top-right" className="glass border border-border rounded-2xl p-3 shadow-card-hover min-w-[190px]">
                <p className="text-xs text-text-muted mb-2 font-medium">Send a tip</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 5, 10, 25, 50, 100].map(amt => (
                    <button key={amt} onClick={() => handleTip(amt)} disabled={tipping}
                      className="px-2 py-1.5 rounded-lg bg-accent-amber/10 hover:bg-accent-amber/20 text-accent-amber text-xs font-bold transition-colors border border-accent-amber/15 disabled:opacity-50">
                      ${amt}
                    </button>
                  ))}
                </div>
              </Popover>
            </div>
            <Button variant={following ? "secondary" : "primary"} size="sm" onClick={handleFollow} className="gap-1.5">
              <Users size={13} /> {following ? "Following" : "Follow"}
            </Button>
          </div>
        </div>

        {/* Name */}
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <h1 className="text-xl font-bold text-text-primary">{creator.displayName}</h1>
          {creator.verified && <BadgeCheck size={18} className="text-primary-light fill-primary/20" />}
          {creator.expertVerified && creator.expertCredential && (
            <span className="text-[10px] bg-accent-green/10 text-accent-green border border-accent-green/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Star size={8} /> Verified Expert
            </span>
          )}
        </div>
        <div className="text-text-muted text-sm mb-3">@{creator.username}</div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">{creator.bio}</p>

        {creator.expertVerified && creator.expertCredential && (
          <div className="mb-3">
            <ExpertBadge credential={creator.expertCredential} />
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {creator.tags.map(tag => <Badge key={tag} variant="ghost">{tag}</Badge>)}
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4 text-sm">
          <div><span className="font-bold text-text-primary">{formatCount(followerCount)}</span><span className="text-text-muted ml-1">followers</span></div>
          <div><span className="font-bold text-text-primary">{formatCount(creator.following)}</span><span className="text-text-muted ml-1">following</span></div>
          <div><span className="font-bold text-text-primary">{formatCount(creator.posts)}</span><span className="text-text-muted ml-1">posts</span></div>
        </div>

        {/* Reputation score */}
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/[0.03] border border-border">
          <Target size={16} className="text-accent-amber flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-text-primary">Reputation Score</span>
              <span className="text-xs font-bold text-accent-amber">{creator.reputationScore}/100</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${creator.reputationScore}%` }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                className="h-full bg-accent-amber rounded-full" />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-text-muted">Accuracy</div>
            <div className="text-sm font-bold text-accent-green">{creator.predictionAccuracy}%</div>
          </div>
        </div>

        {isEarlyBeliever && (
          <div className="mb-4">
            <EarlyBelieverBadge
              followerCountAtFollow={userFollowedAt}
              threshold={creator.earlyBelieverThreshold}
              rank={Math.floor(Math.random() * 50) + 1}
            />
          </div>
        )}
      </div>

      {/* Content tabs */}
      <div className="sticky top-14 z-20 glass-nav border-b border-border px-4">
        <div className="flex gap-1">
          {([
            { id: "posts" as ProfileTab, label: "Posts", icon: <FileText size={13} /> },
            { id: "members" as ProfileTab, label: "Members only", icon: <Lock size={13} /> },
            { id: "media" as ProfileTab, label: "Media", icon: <Grid3x3 size={13} /> },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-all relative",
                activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary")}>
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {activeTab === "posts" && (
              creatorPosts.length > 0
                ? creatorPosts.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} className="mb-3">
                    <FeedPost post={p} />
                  </motion.div>
                ))
                : <div className="text-center py-12 text-text-muted">
                  <FileText size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No posts yet</p>
                </div>
            )}
            {activeTab === "members" && (
              <div className="text-center py-12">
                <Lock size={32} className="mx-auto mb-3 text-accent-amber opacity-50" />
                <p className="text-text-secondary font-medium mb-1">Members only content</p>
                <p className="text-sm text-text-muted mb-4">Join {creator.displayName}'s Inner Circle to unlock</p>
                <Button variant="gradient" size="sm">Become a member</Button>
              </div>
            )}
            {activeTab === "media" && (
              <div className="text-center py-12 text-text-muted">
                <Grid3x3 size={32} className="mx-auto mb-3 opacity-30" />
                <p>No media yet</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
