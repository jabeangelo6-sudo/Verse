"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, TrendingDown, BadgeCheck, Flame, Zap } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_CREATORS } from "@/lib/mock-data";
import { formatCount, formatUSD } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
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

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const filtered = query
    ? MOCK_CREATORS.filter(
        (c) =>
          c.displayName.toLowerCase().includes(query.toLowerCase()) ||
          c.username.toLowerCase().includes(query.toLowerCase()) ||
          c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : MOCK_CREATORS;

  const handleFollow = (creator: typeof MOCK_CREATORS[0]) => {
    setFollowedIds((prev) => {
      const next = new Set(prev);
      if (next.has(creator.id)) {
        next.delete(creator.id);
      } else {
        next.add(creator.id);
        toast("success", `Following ${creator.displayName}`);
      }
      return next;
    });
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

          {/* Top earners */}
          <section className="px-4 mb-6">
            <h2 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
              <Zap size={14} className="text-accent-amber fill-accent-amber" /> Top creators this week
            </h2>
            <div className="space-y-2">
              {[...MOCK_CREATORS].sort((a, b) => b.earnings - a.earnings).slice(0, 3).map((creator, i) => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl card"
                >
                  <span className="text-lg font-bold text-text-muted w-6 text-center">{i + 1}</span>
                  <Link href={`/${creator.username}`} className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Avatar src={creator.avatar} alt={creator.displayName} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-text-primary truncate">{creator.displayName}</span>
                        {creator.verified && <BadgeCheck size={13} className="text-primary-light flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-text-muted">{formatUSD(creator.earnings)} earned</div>
                    </div>
                  </Link>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-text-primary">${creator.tokenPrice}</div>
                    <div className={cn("text-[10px] font-semibold flex items-center gap-0.5 justify-end", creator.tokenChange > 0 ? "text-accent-green" : "text-accent-rose")}>
                      {creator.tokenChange > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                      {Math.abs(creator.tokenChange)}%
                    </div>
                  </div>
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

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {creator.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="ghost">{tag}</Badge>
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-text-primary">{creator.tokenSymbol} ${creator.tokenPrice}</div>
                  <div className={cn("text-[10px] font-semibold flex items-center gap-0.5 justify-end", creator.tokenChange > 0 ? "text-accent-green" : "text-accent-rose")}>
                    {creator.tokenChange > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {Math.abs(creator.tokenChange)}%
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
