"use client";
import { useState } from "react";
import { Fingerprint, Bot, Info } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

type Props = {
  score: number;
  isVerified: boolean;
};

export function HumanityBadge({ score, isVerified }: Props) {
  const [open, setOpen] = useState(false);

  const isHuman = isVerified && score >= 75;
  const isAI    = score < 55;

  if (!isHuman && !isAI) return null;

  const label   = isHuman ? "Verified human-written" : "AI-generated content detected";
  const detail  = isHuman
    ? `Originality score ${score}/100 — our model found no AI generation signals in this post.`
    : `Originality score ${score}/100 — our model detected patterns consistent with AI-assisted writing.`;

  return (
    <span className="relative inline-flex items-center">
      <span className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border font-bold text-[10px]",
        isHuman
          ? "text-accent-green bg-accent-green/10 border-accent-green/20"
          : "text-accent-amber bg-accent-amber/10 border-accent-amber/20"
      )}>
        {isHuman
          ? <Fingerprint size={11} />
          : <Bot size={11} />
        }
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(v => !v); }}
          className="opacity-60 hover:opacity-100 transition-opacity leading-none"
          aria-label={label}>
          <Info size={9} />
        </button>
      </span>

      <Popover open={open} onClose={() => setOpen(false)} anchor="top-left"
        className="w-56 glass border border-border rounded-xl p-3 shadow-card-hover">
        <p className={cn("text-[11px] font-bold mb-1", isHuman ? "text-accent-green" : "text-accent-amber")}>
          {label}
        </p>
        <p className="text-[11px] text-text-muted leading-relaxed">{detail}</p>
      </Popover>
    </span>
  );
}
