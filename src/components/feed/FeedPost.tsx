"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Repeat2, Zap, MoreHorizontal, Lock, BadgeCheck, TrendingUp } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { type Post } from "@/lib/mock-data";
import { formatCount, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

type FeedPostProps = {
  post: Post;
  compact?: boolean;
};

export function FeedPost({ post, compact = false }: FeedPostProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(post.isReposted);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const [showTip, setShowTip] = useState(false);
  const [tipping, setTipping] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((n) => n - 1);
    } else {
      setLiked(true);
      setLikeCount((n) => n + 1);
    }
  };

  const handleRepost = () => {
    if (reposted) {
      setReposted(false);
      setRepostCount((n) => n - 1);
    } else {
      setReposted(true);
      setRepostCount((n) => n + 1);
      toast("success", "Reposted to your audience");
    }
  };

  const handleTip = async (amount: number) => {
    setTipping(true);
    await new Promise((r) => setTimeout(r, 1200));
    setTipping(false);
    setShowTip(false);
    toast("tip", `Tipped ${post.creator.displayName}`, `$${amount}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link href={`/${post.creator.username}`} className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
          <Avatar src={post.creator.avatar} alt={post.creator.displayName} size="md" ring={post.creator.verified} />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-text-primary hover:text-primary-light transition-colors">
                {post.creator.displayName}
              </span>
              {post.creator.verified && <BadgeCheck size={14} className="text-primary-light fill-primary/20" />}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span>@{post.creator.username}</span>
              <span>·</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {post.isExclusive && (
            <Badge variant="amber" className="gap-1">
              <Lock size={9} /> Exclusive
            </Badge>
          )}
          <button className="w-7 h-7 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors opacity-0 group-hover:opacity-100">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      {post.isExclusive ? (
        <div className="relative mb-3">
          <p className="text-text-secondary text-sm leading-relaxed blur-sm select-none">
            {post.content}
          </p>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-base/60 backdrop-blur-sm rounded-xl gap-3 border border-accent-amber/20">
            <Lock size={20} className="text-accent-amber" />
            <p className="text-sm font-semibold text-text-primary text-center px-4">
              Hold 100+ <span className="text-accent-amber font-bold">{post.creator.tokenSymbol}</span> to unlock
            </p>
            <Button variant="gradient" size="sm" className="gap-1.5">
              <TrendingUp size={13} /> Buy {post.creator.tokenSymbol}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-text-primary text-[15px] leading-relaxed mb-3 post-content">
          {post.content}
        </p>
      )}

      {/* Media */}
      {post.media && !post.isExclusive && (
        <div className="relative rounded-2xl overflow-hidden mb-3 bg-bg-elevated aspect-[4/3]">
          <Image src={post.media} alt="Post media" fill className="object-cover" />
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && !compact && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-accent-cyan hover:text-accent-cyan/80 cursor-pointer transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              liked
                ? "text-accent-rose bg-accent-rose/10 hover:bg-accent-rose/15"
                : "text-text-muted hover:text-accent-rose hover:bg-accent-rose/8"
            )}
          >
            <Heart size={15} className={cn("transition-all", liked && "fill-accent-rose animate-heart-pop")} />
            <span>{formatCount(likeCount)}</span>
          </motion.button>

          {/* Comment */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-accent-cyan hover:bg-accent-cyan/8 transition-all duration-200">
            <MessageCircle size={15} />
            <span>{formatCount(post.comments)}</span>
          </button>

          {/* Repost */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleRepost}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              reposted
                ? "text-accent-green bg-accent-green/10 hover:bg-accent-green/15"
                : "text-text-muted hover:text-accent-green hover:bg-accent-green/8"
            )}
          >
            <Repeat2 size={15} />
            <span>{formatCount(repostCount)}</span>
          </motion.button>
        </div>

        {/* Tip button */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTip((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-accent-amber hover:bg-accent-amber/10 transition-all duration-200 border border-accent-amber/0 hover:border-accent-amber/20"
          >
            <Zap size={14} className="fill-accent-amber" />
            <span>${post.tipsUSD > 0 ? post.tipsUSD.toFixed(0) : "Tip"}</span>
          </motion.button>

          {/* Tip picker */}
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute bottom-10 right-0 glass border border-border rounded-2xl p-3 shadow-card-hover z-10 min-w-[180px]"
              >
                <p className="text-xs text-text-muted mb-2 font-medium">Send a tip</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 5, 10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleTip(amt)}
                      disabled={tipping}
                      className="px-2 py-1.5 rounded-lg bg-accent-amber/10 hover:bg-accent-amber/20 text-accent-amber text-xs font-bold transition-colors border border-accent-amber/15 hover:border-accent-amber/30 disabled:opacity-50"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
