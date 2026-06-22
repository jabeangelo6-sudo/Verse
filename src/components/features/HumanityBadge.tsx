"use client";
import { Fingerprint, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  score: number;
  isVerified: boolean;
  compact?: boolean;
};

export function HumanityBadge({ score, isVerified, compact = false }: Props) {
  if (!isVerified) return null;

  const size = compact ? 9 : 11;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border font-bold",
      compact ? "text-[10px]" : "text-[11px] px-2 py-0.5",
      "text-accent-green bg-accent-green/10 border-accent-green/20"
    )}>
      <Fingerprint size={size} /> Human
    </span>
  );
}
