"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Image as ImageIcon, Lock, Globe, Sparkles, Loader2, Send, Zap, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { CollabSplit } from "@/components/features/CollabSplit";
import { useToast } from "@/components/ui/Toast";
import { ME } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Visibility = "public" | "exclusive";
type AIAction = "improve" | "expand" | "shorten" | "hooks";

const AI_ACTIONS: { id: AIAction; label: string; prompt: string }[] = [
  { id: "improve", label: "Improve", prompt: "Make this more engaging and polished" },
  { id: "expand", label: "Expand", prompt: "Add more detail and context" },
  { id: "shorten", label: "Shorten", prompt: "Make this more concise" },
  { id: "hooks", label: "Add hooks", prompt: "Add an attention-grabbing opening line" },
];

export default function CreatePage() {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [isExclusive, setIsExclusive] = useState(false);
  const [aiLoading, setAiLoading] = useState<AIAction | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const MAX_CHARS = 2000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleAI = async (action: AIAction) => {
    if (!content.trim()) {
      toast("warning", "Write something first, then use AI to improve it");
      return;
    }
    setAiLoading(action);
    await new Promise((r) => setTimeout(r, 1800));

    // Simulate AI transformation
    const transformations: Record<AIAction, string> = {
      improve: content + "\n\n[AI enhanced: improved clarity and engagement while preserving your voice]",
      expand: content + "\n\nTo understand why this matters, consider the broader context: the decentralized web isn't just a technical evolution — it's a fundamental shift in who controls information. When your content lives on IPFS and Arweave, no single entity can erase it. That permanence changes everything.",
      shorten: content.split(" ").slice(0, Math.ceil(content.split(" ").length * 0.6)).join(" ") + "...",
      hooks: "🧵 Here's something most people don't realize:\n\n" + content,
    };

    setContent(transformations[action]);
    setCharCount(transformations[action].length);
    setAiLoading(null);
    toast("success", "AI suggestion applied");
  };

  const handlePublish = async () => {
    if (!content.trim()) return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1400));
    setPublishing(false);
    toast("success", "Post published to the decentralized web");
    setContent("");
    setCharCount(0);
  };

  const progress = charCount / MAX_CHARS;
  const circleSize = 24;
  const radius = 10;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-nav px-4 h-14 flex items-center justify-between">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-secondary md:hidden">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-semibold text-text-primary md:ml-0">New Post</span>
        <Button
          variant="primary"
          size="sm"
          onClick={handlePublish}
          loading={publishing}
          disabled={!content.trim() || charCount > MAX_CHARS}
          className="gap-1.5"
        >
          <Send size={13} />
          Publish
        </Button>
      </header>

      <div className="p-4 flex gap-3 flex-1">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar src={ME.avatar} alt={ME.displayName} size="md" />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Visibility toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setVisibility("public")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                visibility === "public"
                  ? "bg-primary/15 text-primary-light border-primary/25"
                  : "bg-transparent text-text-muted border-border hover:border-border-strong"
              )}
            >
              <Globe size={11} /> Public
            </button>
            <button
              onClick={() => setVisibility("exclusive")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                visibility === "exclusive"
                  ? "bg-accent-amber/15 text-accent-amber border-accent-amber/25"
                  : "bg-transparent text-text-muted border-border hover:border-border-strong"
              )}
            >
              <Lock size={11} /> Token-gated
            </button>
          </div>

          {visibility === "exclusive" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl bg-accent-amber/8 border border-accent-amber/15 p-3 text-sm text-text-secondary flex items-center gap-2"
            >
              <Zap size={14} className="text-accent-amber fill-accent-amber flex-shrink-0" />
              Only holders of <strong className="text-accent-amber">YOU tokens</strong> will see this post.
            </motion.div>
          )}

          {/* Main textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              placeholder="What's on your mind? Share a thought, insight, or piece of content with your audience..."
              className="input-base resize-none min-h-[160px] leading-relaxed text-[15px]"
              maxLength={MAX_CHARS + 100}
            />
          </div>

          {/* AI toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-muted flex items-center gap-1 mr-1">
              <Sparkles size={11} className="text-primary-light" /> AI assist:
            </span>
            {AI_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAI(action.id)}
                disabled={!!aiLoading}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/18 text-primary-light border border-primary/15 hover:border-primary/25 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {aiLoading === action.id ? <Loader2 size={10} className="animate-spin" /> : null}
                {action.label}
              </button>
            ))}
          </div>

          {/* Collab split */}
          <CollabSplit />

          {/* Reputation stake toggle */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] border border-border hover:border-border-strong text-text-muted hover:text-text-secondary transition-all">
              <Target size={13} className="text-accent-amber" /> Stake reputation on this claim
            </button>
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-muted hover:text-text-secondary transition-colors">
                <ImageIcon size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] text-text-muted hover:text-text-secondary transition-colors">
                <Clock size={18} />
              </button>
            </div>

            {/* Char counter */}
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-medium", charCount > MAX_CHARS * 0.9 ? "text-accent-rose" : "text-text-muted")}>
                {charCount > MAX_CHARS * 0.8 ? `${MAX_CHARS - charCount}` : ""}
              </span>
              <svg width={circleSize} height={circleSize} className="rotate-[-90deg]">
                <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
                <circle
                  cx={circleSize / 2} cy={circleSize / 2} r={radius}
                  fill="none"
                  stroke={progress > 0.9 ? "#f43f5e" : progress > 0.75 ? "#f59e0b" : "#7c3aed"}
                  strokeWidth={2}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - Math.min(progress, 1))}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />
              </svg>
            </div>
          </div>

          {/* IPFS notice */}
          <div className="divider" />
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <Globe size={11} className="text-accent-cyan" />
            This post will be stored on IPFS and cannot be censored or removed by any platform.
          </p>
        </div>
      </div>
    </div>
  );
}
