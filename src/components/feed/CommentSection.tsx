"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, BadgeCheck } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/hooks/useAuth";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  } | null;
};

export function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then(r => r.json())
      .then(d => setComments(d.comments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handlePost = async () => {
    if (!text.trim() || !user || posting) return;
    const optimistic: Comment = {
      id: Date.now().toString(),
      content: text.trim(),
      createdAt: new Date().toISOString(),
      likeCount: 0,
      creator: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        verified: user.verified,
      },
    };
    setComments(prev => [optimistic, ...prev]);
    setText("");
    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, creatorId: user.id, content: optimistic.content }),
      });
      if (res.ok) {
        const { comment } = await res.json();
        setComments(prev => prev.map(c => c.id === optimistic.id ? { ...comment, creator: optimistic.creator } : c));
      }
    } catch {
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
    } finally {
      setPosting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
      className="border-t border-border pt-3 mt-1 overflow-hidden">

      {/* Input */}
      <div className="flex items-center gap-2 mb-3">
        <Avatar
          src={user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=you`}
          alt="You" size="xs" />
        <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-border rounded-xl px-3 py-2">
          <input ref={inputRef} type="text" value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handlePost()}
            placeholder={user ? "Add a comment..." : "Sign in to comment"}
            disabled={!user}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none" />
          <button onClick={handlePost} disabled={!text.trim() || !user || posting}
            className={cn("transition-colors flex-shrink-0",
              text.trim() && user ? "text-primary-light hover:text-primary" : "text-text-muted cursor-default")}>
            {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-3">
          <Loader2 size={16} className="animate-spin text-text-muted" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-text-muted text-center py-3">No comments yet — be the first</p>
      ) : (
        <AnimatePresence initial={false}>
          {comments.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex gap-2.5 mb-3">
              <Avatar
                src={c.creator?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.creator?.username}`}
                alt={c.creator?.displayName ?? "User"} size="xs" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-text-primary">{c.creator?.displayName ?? "User"}</span>
                  {c.creator?.verified && <BadgeCheck size={11} className="text-primary-light" />}
                  <span className="text-[10px] text-text-muted">{timeAgo(new Date(c.createdAt))}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{c.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
