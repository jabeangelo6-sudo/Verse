"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BadgeCheck, Flame, Users } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_CREATORS, type Creator } from "@/lib/mock-data";
import { formatCount, formatUSD } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TRENDING_TOPICS = [
  { tag: "ZeroKnowledge", posts: 8420, hot: true },
  { tag: "CreatorEconomy", posts: 6230, hot: true },
  { tag: "Restaking", posts: 4810, hot: false },
  { tag: "OnchainArt", posts: 3940, hot: false },
  { tag: "DePIN", posts: 3100, hot: false },
  { tag: "SocialFi", posts: 2780, hot: false },
];

function dbUserToCreator(u: Record<string, unknown>): Creator {
  return {
    id: String(u.id ?? ""),
    username: String(u.username ?? "unknown"),
    displayName: String(u.displayName ?? u.display_name ?? "Creator"),
    avatar: String(u.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`),
    bio: String(u.bio ?? ""),
    verified: Boolean(u.verified),
    followers: Number(u.followerCount ?? u.follower_count ?? 0),
    following: Number(u.followingCount ?? u.following_count ?? 0),
    posts: Number(u.postCount ?? u.post_count ?? 0),
    earnings: Number(u.earnings ?? 0),
    tokenSymbol: String(u.tokenSymbol ?? u.token_symbol ?? "TOKEN"),
    tokenPrice: Number(u.tokenPrice ?? u.token_price ?? 0),
    tokenChange: Number(u.tokenChange ?? u.token_change ?? 0),
    coverGradient: String(u.coverGradient ?? u.cover_gradient ?? "from-violet-900 via-purple-800 to-indigo-900"),
    walletAddress: String(u.walletAddress ?? u.wallet_address ?? ""),
    tags: Array.isArray(u.tags) ? u.tags : [],
    earlyBelieverThreshold: 100,
    foundingSubscriberSlots: 50,
    foundingSubscriberPrice: 5,
    reputationScore: Number(u.reputationScore ?? u.reputation_score ?? 50),
    predictionAccuracy: Number(u.predictionAccuracy ?? u.prediction_accuracy ?? 50),
    expertVerified: Boolean(u.expertVerified ?? u.expert_verified),
    expertCredential: u.expertCredential ? String(u.expertCredential) : undefined,
  };
}

export default function ExplorePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [creators, setCreators] = useState<Creator[]>(MOCK_CREATORS);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) return;
        const data = await res.json();
        const real: Creator[] = (data.users ?? []).map(dbUserToCreator);
        if (real.length > 0) setCreators(real);
      } catch {
        // keep mock creators as fallback
      }
    };
    fetchUsers();
  }, []);

  const filtered = query
    ? creators.filter(
        (c) =>
          c.displayName.toLowerCase().includes(query.toLowerCase()) ||
          c.username.toLowerCase().includes(query.toLowerCase()) ||
          c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : creators;

  const handleFollow = async (creator: Creator) => {
    if (!user) { toast("warning", "Sign in to follow"); return; }
    const isFollowing = followedIds.has(creator.id);
    setFollowedIds((prev) => {
      const next = new Set(prev);
      if (isFollowing) { next.delete(creator.id); } else {
        next.add(creator.id);
        toast("success", `Following ${creator.displayName}`);
      }
      return next;
    });
    try {
      await fetch("/api/follows", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: user.id, followingId: creator.id }),
      });
    } catch {
      // revert on error
      setFollowedIds((prev) => {
        const next = new Set(prev);
        if (isFollowing) { next.add(creator.id); } else { next.delete(creator.id); }
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Explore" />

      {/* Search bar */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search creators, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-base pl-10"
          />
        </div>
      </div>

      {!query && (
        <>
          {/* Trending topics */}
          <section className="px-4 mb-6">
            <h2 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
              <Flame size={14} className="text-accent-rose" /> Trending topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map((topic) => (
                <motion.button
                  key={topic.tag}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-border hover:border-border-strong transition-all"
                >
                  <span className="text-sm text-text-primary font-medium">#{topic.tag}</span>
                  {topic.hot && <Flame size={11} className="text-accent-rose" />}
                  <span className="text-xs text-text-muted">{formatCount(topic.posts)}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Top creators */}
          <section className="px-4 mb-6">
            <h2 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
              <Users size={14} className="text-primary-light" /> Top creators this week
            </h2>
            <div className="space-y-2">
              {[...creators].sort((a, b) => b.followers - a.followers).slice(0, 3).map((creator, i) => (
                <motion.div key={creator.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }} className="flex items-center gap-3 p-3 rounded-xl card">
                  <span className="text-lg font-bold text-text-muted w-6 text-center">{i + 1}</span>
                  <Link href={`/${creator.username}`} className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Avatar src={creator.avatar} alt={creator.displayName} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-text-primary truncate">{creator.displayName}</span>
                        {creator.verified && <BadgeCheck size={13} className="text-primary-light flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-text-muted">{formatCount(creator.followers)} followers</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Creator results */}
      <section className="px-4">
        <h2 className="text-sm font-semibold text-text-secondary mb-3">
          {query ? `Results for "${query}"` : "Discover creators"}
        </h2>
        <div className="space-y-3">
          {filtered.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <Link href={`/${creator.username}`}>
                  <Avatar src={creator.avatar} alt={creator.displayName} size="md" ring={creator.verified} />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <Link href={`/${creator.username}`} className="text-sm font-semibold text-text-primary hover:text-primary-light transition-colors">
                      {creator.displayName}
                    </Link>
                    {creator.verified && <BadgeCheck size={13} className="text-primary-light" />}
                  </div>
                  <div className="text-xs text-text-muted">@{creator.username} · {formatCount(creator.followers)} followers</div>
                </div>
                <Button
                  variant={followedIds.has(creator.id) ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => handleFollow(creator)}
                >
                  {followedIds.has(creator.id) ? "Following" : "Follow"}
                </Button>
              </div>

              <p className="text-sm text-text-secondary mb-3 line-clamp-2">{creator.bio}</p>

              <div className="flex gap-1.5 flex-wrap">
                {creator.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="ghost">{tag}</Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
