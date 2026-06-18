"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Globe, Sparkles, Loader2, Send, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Visibility = "public" | "exclusive";
type AIAction = "improve" | "expand" | "shorten" | "hooks";

const AI_ACTIONS: { id: AIAction; label: string }[] = [
  { id: "improve", label: "Improve" },
  { id: "expand", label: "Expand" },
  { id: "shorten", label: "Shorten" },
  { id: "hooks", label: "Add hook" },
];

export default function CreatePage() {
  const { user, authenticated } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [aiLoading, setAiLoading] = useState<AIAction | null>(null);
  const [publishing, setPublishing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const MAX_CHARS = 2000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleAI = async (action: AIAction) => {
    if (!content.trim()) { toast("warning", "Write something first"); return; }
    setAiLoading(action);
    await new Promise(r => setTimeout(r, 1500));
    const transforms: Record<AIAction, string> = {
      improve: content + "\n\n[AI: polished for clarity and engagement]",
      expand: content + "\n\nTo understand why this matters: the way we share information is shifting. When your content and audience belong to you — not a platform — no one can take them away.",
      shorten: content.split(" ").slice(0, Math.ceil(content.split(" ").length * 0.6)).join(" ") + "...",
      hooks: "Here's something most people don't realize:\n\n" + content,
    };
    setContent(transforms[action]);
    setAiLoading(null);
    toast("success", "AI suggestion applied");
  };

  const handlePublish = async () => {
    if (!content.trim()) return;
    if (!authenticated || !user) { toast("warning", "Sign in to post"); return; }

    setPublishing(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: user.id,
          content,
          type: "text",
          isExclusive: visibility === "exclusive",
          tags: [],
        }),
      });

      if (res.ok) {
        toast("success", "Post published to the decentralized web");
        setContent("");
        router.push("/");
      } else {
        toast("warning", "Failed to publish — try again");
      }
    } catch {
      toast("warning", "Network error — try again");
    } finally {
      setPublishing(false);
    }
  };

  const charCount = content.length;
  const progress = charCount / MAX_CHARS;
  const circleSize = 24;
  const radius = 10;
  const circumference = 2 * Math.PI * radius;

  const avatarSrc = user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=default`;

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-30 glass-nav px-4 h-14 flex items-center justify-between">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-secondary md:hidden">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-semibold text-text-primary">New Post</span>
        <Button variant="primary" size="sm" onClick={handlePublish} loading={publishing}
          disabled={!content.trim() || charCount > MAX_CHARS} className="gap-1.5">
          <Send size={13} /> Publish
        </Button>
      </header>

      <div className="p-4 flex gap-3 flex-1">
        <div className="flex-shrink-0">
          <Avatar src={avatarSrc} alt={user?.displayName ?? "You"} size="md" />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Visibility */}
          <div className="flex gap-2">
            {(["public", "exclusive"] as Visibility[]).map(v => (
              <button key={v} onClick={() => setVisibility(v)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                  visibility === v
                    ? v === "public" ? "bg-primary/15 text-primary-light border-primary/25" : "bg-accent-amber/15 text-accent-amber border-accent-amber/25"
                    : "bg-transparent text-text-muted border-border hover:border-border-strong")}>
                {v === "public" ? <Globe size={11} /> : <Lock size={11} />}
                {v === "public" ? "Public" : "Members only"}
              </button>
            ))}
          </div>

          {visibility === "exclusive" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl bg-accent-amber/8 border border-accent-amber/15 p-3 text-sm text-text-secondary flex items-center gap-2">
              <Zap size={14} className="text-accent-amber fill-accent-amber flex-shrink-0" />
              Only your members will see this post.
            </motion.div>
          )}

          <textarea ref={textareaRef} value={content} onChange={handleChange}
            placeholder="What's on your mind? Share a thought, insight, or piece of content..."
            className="input-base resize-none min-h-[160px] leading-relaxed text-[15px]"
            maxLength={MAX_CHARS + 100} />

          {/* AI toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted flex items-center gap-1 mr-1">
              <Sparkles size={11} className="text-primary-light" /> AI:
            </span>
            {AI_ACTIONS.map(action => (
              <button key={action.id} onClick={() => handleAI(action.id)} disabled={!!aiLoading}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/18 text-primary-light border border-primary/15 transition-all disabled:opacity-50 flex items-center gap-1.5">
                {aiLoading === action.id && <Loader2 size={10} className="animate-spin" />}
                {action.label}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] border border-border hover:border-border-strong text-text-muted hover:text-text-secondary transition-all w-fit">
            <Target size={13} className="text-accent-amber" /> Stake reputation on this claim
          </button>

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-medium", charCount > MAX_CHARS * 0.9 ? "text-accent-rose" : "text-text-muted")}>
                {charCount > MAX_CHARS * 0.8 ? `${MAX_CHARS - charCount}` : ""}
              </span>
              <svg width={circleSize} height={circleSize} className="rotate-[-90deg]">
                <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
                <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none"
                  stroke={progress > 0.9 ? "#f43f5e" : progress > 0.75 ? "#f59e0b" : "#7c3aed"}
                  strokeWidth={2} strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - Math.min(progress, 1))}
                  strokeLinecap="round" className="transition-all duration-200" />
              </svg>
            </div>
          </div>

          <div className="divider" />
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <Globe size={11} className="text-accent-cyan" />
            Your content belongs to you — always.
          </p>
        </div>
      </div>
    </div>
  );
}
