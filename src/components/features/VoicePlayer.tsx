"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown, Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  es: { label: "Spanish", flag: "🇪🇸" },
  zh: { label: "Chinese", flag: "🇨🇳" },
  fr: { label: "French", flag: "🇫🇷" },
  de: { label: "German", flag: "🇩🇪" },
  ja: { label: "Japanese", flag: "🇯🇵" },
  ko: { label: "Korean", flag: "🇰🇷" },
  pt: { label: "Portuguese", flag: "🇧🇷" },
  ar: { label: "Arabic", flag: "🇸🇦" },
  hi: { label: "Hindi", flag: "🇮🇳" },
  ru: { label: "Russian", flag: "🇷🇺" },
  tr: { label: "Turkish", flag: "🇹🇷" },
};

type Props = { languages: string[]; creatorName: string };

export function VoicePlayer({ languages, creatorName }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = async () => {
    if (playing) { setPlaying(false); setProgress(0); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setPlaying(true);
    // Simulate progress
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) { clearInterval(interval); setPlaying(false); setProgress(0); }
    }, 120);
  };

  const lang = LANGUAGES[selectedLang] ?? LANGUAGES.en;

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        {/* Play button */}
        <button
          onClick={handlePlay}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
            playing
              ? "bg-primary/15 text-primary-light border-primary/25"
              : "bg-white/[0.04] text-text-muted border-border hover:border-border-strong hover:text-text-secondary"
          )}
        >
          {loading
            ? <Loader2 size={11} className="animate-spin" />
            : playing ? <Pause size={11} /> : <Volume2 size={11} />
          }
          {loading ? "Generating..." : playing ? "Playing" : "Listen"}
        </button>

        {/* Language picker */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-border hover:border-border-strong text-text-muted hover:text-text-secondary transition-all"
        >
          <span>{lang.flag}</span>
          <ChevronDown size={10} className={cn("transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {/* Progress bar */}
      {playing && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mt-1.5 h-0.5 bg-white/[0.06] rounded-full overflow-hidden origin-left"
        >
          <div className="h-full bg-primary-light rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </motion.div>
      )}

      {/* Language dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            className="absolute top-full right-0 mt-1.5 glass border border-border rounded-xl p-1.5 z-50 shadow-card w-40"
          >
            <p className="text-[10px] text-text-muted px-2 py-1 font-medium">{creatorName}'s voice</p>
            {languages.map(code => {
              const l = LANGUAGES[code];
              if (!l) return null;
              return (
                <button
                  key={code}
                  onClick={() => { setSelectedLang(code); setOpen(false); setPlaying(false); setProgress(0); }}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors",
                    selectedLang === code ? "bg-primary/15 text-primary-light" : "text-text-secondary hover:bg-white/[0.04]"
                  )}
                >
                  <span>{l.flag}</span> {l.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
