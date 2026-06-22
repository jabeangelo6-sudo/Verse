"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown, Pause, Loader2, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES: Record<string, { label: string; flag: string; bcp47: string }> = {
  en: { label: "English", flag: "🇺🇸", bcp47: "en-US" },
  es: { label: "Spanish", flag: "🇪🇸", bcp47: "es-ES" },
  fr: { label: "French", flag: "🇫🇷", bcp47: "fr-FR" },
  de: { label: "German", flag: "🇩🇪", bcp47: "de-DE" },
  pt: { label: "Portuguese", flag: "🇧🇷", bcp47: "pt-BR" },
  hi: { label: "Hindi", flag: "🇮🇳", bcp47: "hi-IN" },
  ar: { label: "Arabic", flag: "🇸🇦", bcp47: "ar-SA" },
  zh: { label: "Chinese", flag: "🇨🇳", bcp47: "zh-CN" },
  ja: { label: "Japanese", flag: "🇯🇵", bcp47: "ja-JP" },
  ko: { label: "Korean", flag: "🇰🇷", bcp47: "ko-KR" },
  ru: { label: "Russian", flag: "🇷🇺", bcp47: "ru-RU" },
  tr: { label: "Turkish", flag: "🇹🇷", bcp47: "tr-TR" },
  it: { label: "Italian", flag: "🇮🇹", bcp47: "it-IT" },
  nl: { label: "Dutch", flag: "🇳🇱", bcp47: "nl-NL" },
  pl: { label: "Polish", flag: "🇵🇱", bcp47: "pl-PL" },
  sv: { label: "Swedish", flag: "🇸🇪", bcp47: "sv-SE" },
  id: { label: "Indonesian", flag: "🇮🇩", bcp47: "id-ID" },
  th: { label: "Thai", flag: "🇹🇭", bcp47: "th-TH" },
  vi: { label: "Vietnamese", flag: "🇻🇳", bcp47: "vi-VN" },
  uk: { label: "Ukrainian", flag: "🇺🇦", bcp47: "uk-UA" },
};

type Props = { languages: string[]; creatorName: string; content: string };

export function VoicePlayer({ languages, creatorName, content }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0] ?? "en");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  const handlePlay = () => {
    if (!window.speechSynthesis) return;

    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    setLoading(true);
    window.speechSynthesis.cancel();

    const lang = LANGUAGES[selectedLang] ?? LANGUAGES.en;
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = lang.bcp47;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // Pick best available voice for the language
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(lang.bcp47.split("-")[0]));
    if (match) utterance.voice = match;

    utterance.onstart = () => { setLoading(false); setPlaying(true); };
    utterance.onend = () => { setPlaying(false); };
    utterance.onerror = () => { setLoading(false); setPlaying(false); };

    utteranceRef.current = utterance;

    // Voices may not be loaded yet on first render
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const v2 = window.speechSynthesis.getVoices();
        const m2 = v2.find(v => v.lang.startsWith(lang.bcp47.split("-")[0]));
        if (m2) utterance.voice = m2;
        setLoading(false);
        window.speechSynthesis.speak(utterance);
      };
    } else {
      setLoading(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  };

  const handleLangChange = (code: string) => {
    if (playing) { window.speechSynthesis?.cancel(); setPlaying(false); }
    setSelectedLang(code);
    setOpen(false);
  };

  const lang = LANGUAGES[selectedLang] ?? LANGUAGES.en;
  const availableLangs = languages.filter(l => LANGUAGES[l]);

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        <button onClick={handlePlay}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
            playing
              ? "bg-primary/15 text-primary-light border-primary/25"
              : "bg-white/[0.04] text-text-muted border-border hover:border-border-strong hover:text-text-secondary"
          )}>
          {loading
            ? <Loader2 size={11} className="animate-spin" />
            : playing ? <Pause size={11} /> : <Volume2 size={11} />
          }
          {loading ? "Loading..." : playing ? "Pause" : "Listen"}
        </button>

        {playing && (
          <button onClick={handleStop}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-border text-text-muted hover:text-accent-rose transition-colors">
            <Square size={9} className="fill-current" />
          </button>
        )}

        <button onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-border hover:border-border-strong text-text-muted hover:text-text-secondary transition-all">
          <span>{lang.flag}</span>
          <ChevronDown size={10} className={cn("transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {/* Animated wave when playing */}
      {playing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-0.5 mt-1.5">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div key={i} className="w-0.5 bg-primary-light rounded-full"
              animate={{ height: ["4px", `${6 + i * 3}px`, "4px"] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }} />
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            className="absolute top-full left-0 mt-1.5 glass border border-border rounded-xl p-1.5 z-50 shadow-card w-44 max-h-56 overflow-y-auto no-scrollbar">
            <p className="text-[10px] text-text-muted px-2 py-1 font-medium">{creatorName}'s voice</p>
            {availableLangs.map(code => {
              const l = LANGUAGES[code];
              return (
                <button key={code} onClick={() => handleLangChange(code)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors",
                    selectedLang === code ? "bg-primary/15 text-primary-light" : "text-text-secondary hover:bg-white/[0.04]"
                  )}>
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
