"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { FeedPost } from "@/components/feed/FeedPost";
import { PostSkeleton } from "@/components/ui/Skeleton";
import { MOCK_POSTS, MOCK_CREATORS, type Post, type Creator } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";

type FeedTab = "for-you" | "following" | "trending";

const TABS: { id: FeedTab; label: string; icon: React.ReactNode }[] = [
  { id: "for-you", label: "For You", icon: <Sparkles size={13} /> },
  { id: "following", label: "Following", icon: <Users size={13} /> },
  { id: "trending", label: "Trending", icon: <TrendingUp size={13} /> },
];

function toCreator(c: Record<string, unknown>): Creator {
  return {
    id: String(c.id ?? ""),
    username: String(c.username ?? "unknown"),
    displayName: String(c.displayName ?? c.display_name ?? "Creator"),
    avatar: String(c.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`),
    bio: String(c.bio ?? ""),
    verified: Boolean(c.verified),
    followers: Number(c.followerCount ?? c.follower_count ?? 0),
    following: Number(c.followingCount ?? c.following_count ?? 0),
    posts: Number(c.postCount ?? c.post_count ?? 0),
    earnings: Number(c.earnings ?? 0),
    tokenSymbol: String(c.tokenSymbol ?? c.token_symbol ?? "TOKEN"),
    tokenPrice: Number(c.tokenPrice ?? c.token_price ?? 0),
    tokenChange: Number(c.tokenChange ?? c.token_change ?? 0),
    coverGradient: String(c.coverGradient ?? c.cover_gradient ?? "from-violet-900 via-purple-800 to-indigo-900"),
    walletAddress: String(c.walletAddress ?? c.wallet_address ?? ""),
    tags: Array.isArray(c.tags) ? c.tags : [],
    earlyBelieverThreshold: 100,
    foundingSubscriberSlots: 50,
    foundingSubscriberPrice: 5,
    reputationScore: Number(c.reputationScore ?? c.reputation_score ?? 50),
    predictionAccuracy: Number(c.predictionAccuracy ?? c.prediction_accuracy ?? 50),
    expertVerified: Boolean(c.expertVerified ?? c.expert_verified),
    expertCredential: c.expertCredential ? String(c.expertCredential) : undefined,
  };
}

function toPost(item: { post: Record<string, unknown>; creator: Record<string, unknown> }): Post {
  const creator = toCreator(item.creator);
  const p = item.post;
  return {
    id: String(p.id ?? ""),
    creator,
    type: (p.type as Post["type"]) ?? "text",
    content: String(p.content ?? ""),
    media: p.media ? String(p.media) : undefined,
    isExclusive: Boolean(p.isExclusive ?? p.is_exclusive),
    tags: Array.isArray(p.tags) ? p.tags : [],
    humanityScore: Number(p.humanityScore ?? p.humanity_score ?? 85),
    isHumanVerified: Boolean(p.isHumanVerified ?? p.is_human_verified),
    hasVoice: Boolean(p.hasVoice ?? p.has_voice),
    voiceLanguages: Boolean(p.hasVoice ?? p.has_voice) ? ["en", "es", "fr"] : undefined,
    hasStake: Boolean(p.hasStake ?? p.has_stake),
    stakeTopic: p.stakeTopic ? String(p.stakeTopic) : undefined,
    stakeAmount: p.stakeAmount != null ? Number(p.stakeAmount) : undefined,
    stakeYes: p.stakeYes != null ? Number(p.stakeYes) : undefined,
    stakeNo: p.stakeNo != null ? Number(p.stakeNo) : undefined,
    stakeDeadline: p.stakeDeadline ? new Date(String(p.stakeDeadline)) : undefined,
    likes: Number(p.likeCount ?? p.like_count ?? 0),
    comments: Number(p.commentCount ?? p.comment_count ?? 0),
    reposts: Number(p.repostCount ?? p.repost_count ?? 0),
    tips: Number(p.tipsUSD ?? p.tipsUsd ?? p.tips_usd ?? 0),
    tipsUSD: Number(p.tipsUSD ?? p.tipsUsd ?? p.tips_usd ?? 0),
    isLiked: false,
    isReposted: false,
    collaborators: [],
    createdAt: p.createdAt ? new Date(String(p.createdAt)) : new Date(),
  };
}

export default function FeedPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams({ tab: activeTab });
        if (user?.id) params.set("userId", user.id);
        const res = await fetch(`/api/feed?${params}`);
        if (!res.ok) throw new Error("Feed fetch failed");
        const data = await res.json();
        const realPosts: Post[] = (data.posts ?? []).map(toPost);
        // Use real posts if available, otherwise show mock data
        setPosts(realPosts.length > 0 ? realPosts : MOCK_POSTS);
      } catch {
        setError(true);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [activeTab, user?.id]);

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar showSearch showSettings />

      {/* Stories / Who to follow */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {MOCK_CREATORS.map((creator) => (
            <Link key={creator.id} href={`/${creator.username}`} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <Avatar src={creator.avatar} alt={creator.displayName} size="md" ring={creator.verified} />
              <span className="text-[10px] text-text-muted w-14 text-center truncate">{creator.username}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Feed tabs */}
      <div className="sticky top-14 z-20 glass-nav px-4 border-b border-border">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-all duration-200 relative",
                activeTab === tab.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
              )}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="feed-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-3 p-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {error && (
                <p className="text-xs text-text-muted text-center py-2">Showing cached posts — reconnecting…</p>
              )}
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <FeedPost post={post} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
