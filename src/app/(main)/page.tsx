"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { FeedPost } from "@/components/feed/FeedPost";
import { PostSkeleton } from "@/components/ui/Skeleton";
import { MOCK_POSTS, MOCK_CREATORS } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FeedTab = "for-you" | "following" | "trending";

const TABS: { id: FeedTab; label: string; icon: React.ReactNode }[] = [
  { id: "for-you", label: "For You", icon: <Sparkles size={13} /> },
  { id: "following", label: "Following", icon: <Users size={13} /> },
  { id: "trending", label: "Trending", icon: <TrendingUp size={13} /> },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");
  const [loading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar showSearch />

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
              {MOCK_POSTS.map((post, i) => (
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
