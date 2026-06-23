"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { FeedPost } from "@/components/feed/FeedPost";
import { PostSkeleton } from "@/components/ui/Skeleton";
import { CommentSection } from "@/components/feed/CommentSection";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { MOCK_POSTS, type Post, type Creator } from "@/lib/mock-data";
import { formatCount } from "@/lib/utils";

function toCreator(c: Record<string, unknown>): Creator {
  return {
    id: String(c.id ?? ""),
    username: String(c.username ?? ""),
    displayName: String(c.displayName ?? c.display_name ?? c.username ?? ""),
    avatar: String(c.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`),
    bio: String(c.bio ?? ""),
    verified: Boolean(c.verified),
    followers: Number(c.followerCount ?? 0),
    following: Number(c.followingCount ?? 0),
    posts: Number(c.postCount ?? 0),
    earnings: 0, tokenSymbol: "TOKEN", tokenPrice: 0, tokenChange: 0,
    coverGradient: String(c.coverGradient ?? "from-violet-900 via-purple-800 to-indigo-900"),
    walletAddress: "", tags: [], earlyBelieverThreshold: 100,
    foundingSubscriberSlots: 50, foundingSubscriberPrice: 5,
    reputationScore: 50, predictionAccuracy: 50,
    expertVerified: false,
  };
}

function toPost(data: { post: Record<string, unknown>; creator: Record<string, unknown> }): Post {
  const p = data.post;
  return {
    id: String(p.id ?? ""),
    creator: toCreator(data.creator),
    type: (p.type as Post["type"]) ?? "text",
    content: String(p.content ?? ""),
    media: p.media ? String(p.media) : undefined,
    isExclusive: Boolean(p.isExclusive ?? p.is_exclusive),
    tags: Array.isArray(p.tags) ? p.tags : [],
    humanityScore: Number(p.humanityScore ?? 85),
    isHumanVerified: Boolean(p.isHumanVerified ?? p.is_human_verified),
    hasVoice: Boolean(p.hasVoice),
    voiceLanguages: Boolean(p.hasVoice) ? ["en", "es", "fr"] : undefined,
    hasStake: Boolean(p.hasStake),
    stakeTopic: p.stakeTopic ? String(p.stakeTopic) : undefined,
    stakeAmount: p.stakeAmount != null ? Number(p.stakeAmount) : undefined,
    stakeYes: 0, stakeNo: 0,
    stakeDeadline: p.stakeDeadline ? new Date(String(p.stakeDeadline)) : undefined,
    likes: Number(p.likeCount ?? 0),
    comments: Number(p.commentCount ?? 0),
    reposts: Number(p.repostCount ?? 0),
    tips: 0, tipsUSD: Number(p.tipsUSD ?? 0),
    isLiked: false, isReposted: false, collaborators: [],
    createdAt: p.createdAt ? new Date(String(p.createdAt)) : new Date(),
  };
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(toPost(data));
        } else {
          setPost(MOCK_POSTS.find(p => p.id === params.id) ?? MOCK_POSTS[0]);
        }
      } catch {
        setPost(MOCK_POSTS.find(p => p.id === params.id) ?? MOCK_POSTS[0]);
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  const relatedPosts = post
    ? MOCK_POSTS.filter(p => p.creator.username === post.creator.username && p.id !== post.id).slice(0, 2)
    : [];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-30 glass-nav px-4 h-14 flex items-center gap-3">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-secondary md:hidden">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-semibold text-text-primary">Post</span>
      </header>

      <div className="p-4 space-y-4 max-w-2xl mx-auto w-full">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : post ? (
          <>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <FeedPost post={post} />
            </motion.div>

            {/* Comments — always expanded on detail page */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={14} className="text-text-muted" />
                <span className="text-sm font-semibold text-text-primary">Comments</span>
                <span className="text-xs text-text-muted bg-white/[0.05] px-1.5 py-0.5 rounded-full">{post.comments}</span>
              </div>
              <CommentSection postId={post.id} />
            </motion.div>

            {/* Creator card */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="card p-4">
              <div className="flex items-center gap-3">
                <Link href={`/${post.creator.username}`}>
                  <Avatar src={post.creator.avatar} alt={post.creator.displayName} size="lg" ring={post.creator.verified} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/${post.creator.username}`} className="flex items-center gap-1.5">
                    <span className="font-bold text-text-primary hover:text-primary-light transition-colors">{post.creator.displayName}</span>
                    {post.creator.verified && <BadgeCheck size={15} className="text-primary-light" />}
                  </Link>
                  <div className="text-xs text-text-muted">@{post.creator.username}</div>
                  <div className="flex gap-3 mt-1.5 text-xs">
                    <span><strong className="text-text-primary">{formatCount(post.creator.followers)}</strong> <span className="text-text-muted">followers</span></span>
                    <span><strong className="text-text-primary">{formatCount(post.creator.posts)}</strong> <span className="text-text-muted">posts</span></span>
                  </div>
                </div>
                <Button variant={following ? "secondary" : "primary"} size="sm"
                  onClick={() => setFollowing(v => !v)}>
                  {following ? "Following" : "Follow"}
                </Button>
              </div>
              {post.creator.bio && (
                <p className="text-sm text-text-secondary mt-3 leading-relaxed">{post.creator.bio}</p>
              )}
            </motion.div>

            {/* More from creator */}
            {relatedPosts.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 px-1">
                  More from @{post.creator.username}
                </p>
                <div className="space-y-3">
                  {relatedPosts.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}>
                      <FeedPost post={p} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-text-muted">
            <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
            <p>Post not found</p>
          </div>
        )}
      </div>
    </div>
  );
}
