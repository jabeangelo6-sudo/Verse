"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Globe, Sparkles, Loader2, Send, Zap, Target, Link2, X, ImageIcon, Video } from "lucide-react";
import { mediaStore } from "@/lib/media-store";
import { uploadMedia } from "@/lib/upload";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { useIntegrations } from "@/lib/hooks/useIntegrations";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Visibility = "public" | "exclusive";
type AIAction = "improve" | "expand" | "shorten" | "hooks";

const CROSS_POST_PLATFORMS = [
  { id: "twitter", label: "X", color: "bg-black border-zinc-700" },
  { id: "linkedin", label: "LinkedIn", color: "bg-[#0077B5]/20 border-[#0077B5]/40" },
  { id: "farcaster", label: "Farcaster", color: "bg-violet-500/20 border-violet-500/40" },
  { id: "telegram", label: "Telegram", color: "bg-[#229ED9]/20 border-[#229ED9]/40" },
  { id: "instagram", label: "Instagram", color: "bg-pink-600/20 border-pink-500/40" },
  { id: "tiktok", label: "TikTok", color: "bg-black border-zinc-700" },
];

const AI_ACTIONS: { id: AIAction; label: string }[] = [
  { id: "improve", label: "Improve" },
  { id: "expand", label: "Expand" },
  { id: "shorten", label: "Shorten" },
  { id: "hooks", label: "Add hook" },
];

export default function CreatePage() {
  const { user, authenticated } = useAuth();
  const { isConnected } = useIntegrations();
  const [pendingMedia, setPendingMedia] = useState<{ url: string; type: "image" | "video"; name: string; file?: File } | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const m = mediaStore.get();
    if (m) { setPendingMedia(m); mediaStore.clear(); }
  }, []);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [aiLoading, setAiLoading] = useState<AIAction | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set(["twitter", "farcaster"]));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const connectedPlatforms = CROSS_POST_PLATFORMS.filter(p => isConnected(p.id));

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };
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
      // Upload media if present
      let mediaUrl: string | undefined;
      if (pendingMedia?.file) {
        setUploading(true);
        try {
          mediaUrl = await uploadMedia(pendingMedia.file);
        } catch {
          toast("warning", "Media upload failed — posting without it");
        } finally {
          setUploading(false);
        }
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: user.id,
          content,
          type: pendingMedia ? pendingMedia.type : "text",
          media: mediaUrl,
          isExclusive: visibility === "exclusive",
          tags: [],
        }),
      });

      if (res.ok) {
        toast("success", "Post published");
        // Cross-post to connected platforms
        if (selectedPlatforms.has("twitter") && isConnected("twitter")) {
          const tweetText = `${content.slice(0, 240)}\n\n— via Verse`;
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, "_blank");
        }
        if (selectedPlatforms.has("farcaster") && isConnected("farcaster")) {
          const castText = content.slice(0, 280);
          window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`, "_blank");
        }
        if (selectedPlatforms.has("instagram") && isConnected("instagram")) {
          await navigator.clipboard.writeText(content);
          toast("success", "Caption copied", "Open Instagram and paste to post");
        }
        if (selectedPlatforms.has("tiktok") && isConnected("tiktok")) {
          await navigator.clipboard.writeText(content);
          toast("success", "Caption copied", "Open TikTok and paste to post");
        }
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
          {/* Media preview */}
          {pendingMedia && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden border border-border bg-bg-elevated">
              {pendingMedia.type === "image" ? (
                <img src={pendingMedia.url} alt="Selected" className="w-full max-h-72 object-cover" />
              ) : (
                <video src={pendingMedia.url} controls className="w-full max-h-72" />
              )}
              <button onClick={() => setPendingMedia(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                <X size={14} />
              </button>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg">
                {pendingMedia.type === "image" ? <ImageIcon size={11} className="text-white" /> : <Video size={11} className="text-white" />}
                <span className="text-[10px] text-white font-medium">{pendingMedia.type === "image" ? "Photo" : "Video"}</span>
              </div>
            </motion.div>
          )}

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

          {/* Cross-post bar */}
          {connectedPlatforms.length > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-text-muted">Also post to:</span>
              {connectedPlatforms.map(p => (
                <button key={p.id} onClick={() => togglePlatform(p.id)}
                  className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
                    p.color,
                    selectedPlatforms.has(p.id) ? "opacity-100 text-white" : "opacity-40 text-text-muted")}>
                  {p.label}
                </button>
              ))}
            </div>
          ) : (
            <Link href="/integrations" className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary-light transition-colors">
              <Link2 size={11} /> Connect platforms to cross-post
            </Link>
          )}

          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <Globe size={11} className="text-accent-cyan" />
            Your content belongs to you — always.
          </p>
        </div>
      </div>
    </div>
  );
}
