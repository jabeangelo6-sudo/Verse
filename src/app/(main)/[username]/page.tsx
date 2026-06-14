"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BadgeCheck, TrendingUp, TrendingDown, Share2, MoreHorizontal, Grid3x3, FileText, Lock, Zap, Users, Link2, Target, Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FeedPost } from "@/components/feed/FeedPost";
import { EarlyBelieverBadge } from "@/components/features/EarlyBelieverBadge";
import { SubscriptionNFT } from "@/components/features/SubscriptionNFT";
import { ExpertBadge } from "@/components/features/ExpertBadge";
import { useToast } from "@/components/ui/Toast";
import { MOCK_CREATORS, MOCK_POSTS } from "@/lib/mock-data";
import { formatCount, formatUSD } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProfileTab = "posts" | "exclusive" | "collected";

export default function CreatorProfilePage({ params }: { params: { username: string } }) {
  const creator = MOCK_CREATORS.find(c => c.username === params.username) ?? MOCK_CREATORS[0];
  const creatorPosts = MOCK_POSTS.filter(p => p.creator.username === creator.username);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(creator.followers);
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [showBuyToken, setShowBuyToken] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const { toast } = useToast();

  // Simulate: current user followed this creator early
  const userFollowedAt = Math.floor(creator.followers * 0.012);
  const isEarlyBeliever = userFollowedAt < creator.earlyBelieverThreshold;

  const handleFollow = () => {
    setFollowing(v => !v);
    setFollowerCount(n => following ? n - 1 : n + 1);
    if (!following) toast("success", `Following ${creator.displayName}`);
  };

  const handleBuyToken = async () => {
    if (tokenAmount <= 0) return;
    await new Promise(r => setTimeout(r, 1500));
    toast("success", `Bought ${tokenAmount} ${creator.tokenSymbol}`, formatUSD(tokenAmount * creator.tokenPrice));
    setShowBuyToken(false);
    setTokenAmount(0);
  };

  const priceUp = creator.tokenChange > 0;

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-nav px-4 h-14 flex items-center justify-between md:hidden">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-secondary">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-semibold text-text-primary">@{creator.username}</span>
        <div className="flex gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-secondary"><Share2 size={18} /></button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-secondary"><MoreHorizontal size={18} /></button>
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
            <Button variant="secondary" size="sm"><Link2 size={13} /> Tip</Button>
            <Button variant={following ? "secondary" : "primary"} size="sm" onClick={handleFollow}>
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
        <div className="flex items-center gap-2 mb-3">
          <span className="text-text-muted text-sm">@{creator.username}</span>
          <span className="text-text-muted">·</span>
          <span className="text-xs text-text-muted font-mono">{creator.walletAddress.slice(0, 6)}...{creator.walletAddress.slice(-4)}</span>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">{creator.bio}</p>

        {/* Expert credential */}
        {creator.expertVerified && creator.expertCredential && (
          <div className="mb-3">
            <ExpertBadge credential={creator.expertCredential} />
          </div>
        )}

        {/* Tags */}
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
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${creator.reputationScore}%` }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                className="h-full bg-accent-amber rounded-full"
              />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-text-muted">Prediction accuracy</div>
            <div className="text-sm font-bold text-accent-green">{creator.predictionAccuracy}%</div>
          </div>
        </div>

        {/* Early Believer badge */}
        {isEarlyBeliever && (
          <div className="mb-4">
            <EarlyBelieverBadge
              followerCountAtFollow={userFollowedAt}
              threshold={creator.earlyBelieverThreshold}
              rank={Math.floor(Math.random() * 50) + 1}
            />
          </div>
        )}

        {/* Creator token */}
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Zap size={14} className="text-white fill-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary">{creator.tokenSymbol}</div>
                <div className="text-xs text-text-muted">Creator token</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-text-primary">${creator.tokenPrice.toFixed(4)}</div>
              <div className={cn("text-xs font-semibold flex items-center gap-0.5 justify-end", priceUp ? "text-accent-green" : "text-accent-rose")}>
                {priceUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {Math.abs(creator.tokenChange)}%
              </div>
            </div>
          </div>
          <Button variant="gradient" size="sm" fullWidth onClick={() => setShowBuyToken(v => !v)}>
            <TrendingUp size={13} /> Buy {creator.tokenSymbol}
          </Button>
          <AnimatePresence>
            {showBuyToken && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-3 pt-3 border-t border-border flex gap-2 items-center">
                  <input type="number" min={1} placeholder="Amount" value={tokenAmount || ""} onChange={e => setTokenAmount(Number(e.target.value))} className="input-base h-9 text-sm" />
                  <Button variant="primary" size="sm" onClick={handleBuyToken}>Buy</Button>
                </div>
                {tokenAmount > 0 && <p className="text-xs text-text-muted mt-1.5">≈ {formatUSD(tokenAmount * creator.tokenPrice)}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subscription NFTs */}
        <div className="mb-4">
          <SubscriptionNFT creator={creator} />
        </div>

        {/* Portable audience */}
        <div className="rounded-xl bg-accent-cyan/5 border border-accent-cyan/15 px-4 py-3 mb-4 flex items-center gap-3">
          <Users size={16} className="text-accent-cyan flex-shrink-0" />
          <p className="text-xs text-text-secondary">
            <span className="text-accent-cyan font-semibold">{formatCount(followerCount)} followers</span> are stored on-chain —
            {" "}{creator.displayName} owns their audience everywhere.
          </p>
        </div>
      </div>

      {/* Content tabs */}
      <div className="sticky top-14 z-20 glass-nav border-b border-border px-4">
        <div className="flex gap-1">
          {([
            { id: "posts" as ProfileTab, label: "Posts", icon: <FileText size={13} /> },
            { id: "exclusive" as ProfileTab, label: "Exclusive", icon: <Lock size={13} /> },
            { id: "collected" as ProfileTab, label: "Collected", icon: <Grid3x3 size={13} /> },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-all relative",
                activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary")}>
              {tab.icon} {tab.label}
              {activeTab === tab.id && <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />}
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
                  <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="mb-3">
                    <FeedPost post={p} />
                  </motion.div>
                ))
                : <div className="text-center py-12 text-text-muted"><FileText size={32} className="mx-auto mb-3 opacity-30" /><p>No posts yet</p></div>
            )}
            {activeTab === "exclusive" && (
              <div className="text-center py-12">
                <Lock size={32} className="mx-auto mb-3 text-accent-amber opacity-50" />
                <p className="text-text-secondary font-medium mb-1">Exclusive content</p>
                <p className="text-sm text-text-muted">Hold {creator.tokenSymbol} tokens to unlock</p>
                <Button variant="gradient" size="sm" className="mt-4">Buy {creator.tokenSymbol}</Button>
              </div>
            )}
            {activeTab === "collected" && (
              <div className="text-center py-12 text-text-muted">
                <Grid3x3 size={32} className="mx-auto mb-3 opacity-30" />
                <p>No NFTs collected yet</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
