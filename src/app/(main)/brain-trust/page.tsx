"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, BadgeCheck, Send, Sparkles, TrendingUp, TrendingDown, Minus, Lock } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

type Sentiment = "bullish" | "bearish" | "neutral";

interface ExpertOpinion {
  id: string;
  expert: { username: string; displayName: string; avatar: string; credential: string; reputationScore: number };
  opinion: string;
  sentiment: Sentiment;
  confidence: number;
}

interface BrainTrustSession {
  id: string;
  topic: string;
  question: string;
  category: string;
  expertCount: number;
  opinions: ExpertOpinion[];
  aggregateSentiment: Sentiment;
  bullish: number;
  bearish: number;
  neutral: number;
  isPremium: boolean;
  priceUSD: number;
}

const MOCK_SESSIONS: BrainTrustSession[] = [
  {
    id: "1",
    topic: "Bitcoin ETF Impact",
    question: "Will Bitcoin ETF inflows sustain above $1B/day through Q3 2025?",
    category: "Finance",
    expertCount: 8,
    isPremium: false,
    priceUSD: 0,
    aggregateSentiment: "bullish",
    bullish: 62, bearish: 25, neutral: 13,
    opinions: [
      { id: "a", expert: { username: "crypto_phd", displayName: "Dr. Kim Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kim", credential: "PhD Economics", reputationScore: 94 }, opinion: "Institutional demand is structurally different from retail. ETF flows create a floor that didn't exist pre-2024. I expect sustained inflows.", sentiment: "bullish", confidence: 82 },
      { id: "b", expert: { username: "macro_jane", displayName: "Jane Osei", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane", credential: "Hedge Fund PM", reputationScore: 88 }, opinion: "The $1B/day figure is a high bar. More likely we see $400-600M average with spikes during volatility events.", sentiment: "bearish", confidence: 71 },
      { id: "c", expert: { username: "quant_raj", displayName: "Raj Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=raj", credential: "Quant Analyst", reputationScore: 91 }, opinion: "My models suggest flows will be lumpy but the annual average will surprise to the upside. Pension funds haven't even started.", sentiment: "bullish", confidence: 77 },
    ],
  },
  {
    id: "2",
    topic: "AI Content Authenticity",
    question: "Will regulators require AI-disclosure on social media posts by 2026?",
    category: "Policy",
    expertCount: 6,
    isPremium: false,
    priceUSD: 0,
    aggregateSentiment: "bullish",
    bullish: 71, bearish: 14, neutral: 15,
    opinions: [
      { id: "d", expert: { username: "policy_watch", displayName: "Prof. Sarah Mills", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", credential: "Internet Law Prof", reputationScore: 96 }, opinion: "The EU AI Act already mandates this. The US will follow within 18 months, especially after the 2026 midterms.", sentiment: "bullish", confidence: 88 },
    ],
  },
  {
    id: "3",
    topic: "DePIN Infrastructure",
    question: "Which DePIN sector (storage, compute, wireless) will have the most real-world adoption by end of 2025?",
    category: "Technology",
    expertCount: 10,
    isPremium: true,
    priceUSD: 49,
    aggregateSentiment: "neutral",
    bullish: 40, bearish: 20, neutral: 40,
    opinions: [],
  },
];

const SENTIMENT_CONFIG = {
  bullish: { color: "text-accent-green", bg: "bg-accent-green/15", icon: <TrendingUp size={13} />, label: "Bullish" },
  bearish: { color: "text-accent-rose", bg: "bg-accent-rose/15", icon: <TrendingDown size={13} />, label: "Bearish" },
  neutral: { color: "text-text-muted", bg: "bg-white/[0.06]", icon: <Minus size={13} />, label: "Neutral" },
};

export default function BrainTrustPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>("1");
  const [showRequest, setShowRequest] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [question, setQuestion] = useState("");

  const handleRequest = async () => {
    if (!question.trim()) return;
    setRequesting(true);
    await new Promise(r => setTimeout(r, 1500));
    setRequesting(false);
    setShowRequest(false);
    setQuestion("");
    toast("success", "Question submitted — experts will respond within 24 hours");
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Brain Trust" />

      {/* Hero */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-accent-cyan/10 to-primary/10 border border-primary/20 p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={16} className="text-primary-light" />
            <span className="text-sm font-bold text-primary-light">Aggregated expert intelligence</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Real questions answered by verified experts, weighted by reputation score. Not polls — calibrated intelligence.
          </p>
          <div className="flex gap-4">
            {[["94", "Avg rep score"], ["48", "Verified experts"], ["89%", "Accuracy rate"]].map(([val, label]) => (
              <div key={label} className="flex-1 text-center">
                <div className="text-base font-bold text-text-primary">{val}</div>
                <div className="text-[10px] text-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="primary" size="sm" className="w-full gap-2 mb-4" onClick={() => setShowRequest(true)}>
          <Send size={13} /> Submit a Question
        </Button>
      </div>

      {/* Sessions */}
      <div className="px-4 space-y-3">
        {MOCK_SESSIONS.map((session, i) => {
          const isOpen = expanded === session.id;
          const cfg = SENTIMENT_CONFIG[session.aggregateSentiment];
          return (
            <motion.div key={session.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} className="card overflow-hidden">
              {/* Header */}
              <button className="w-full p-4 text-left" onClick={() => setExpanded(isOpen ? null : session.id)}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="ghost" className="text-[10px]">{session.category}</Badge>
                      {session.isPremium && (
                        <div className="flex items-center gap-1 text-[10px] text-accent-amber font-bold">
                          <Lock size={9} /> ${session.priceUSD} report
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-text-primary leading-snug mb-2">{session.question}</p>
                    <div className="flex items-center gap-3">
                      <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold", cfg.bg, cfg.color)}>
                        {cfg.icon} {cfg.label}
                      </div>
                      <span className="text-xs text-text-muted">{session.expertCount} experts</span>
                    </div>
                  </div>
                </div>

                {/* Sentiment bar */}
                <div className="mt-3 flex rounded-full overflow-hidden h-1.5 gap-px">
                  <div className="bg-accent-green rounded-l-full transition-all" style={{ width: `${session.bullish}%` }} />
                  <div className="bg-text-muted/30 transition-all" style={{ width: `${session.neutral}%` }} />
                  <div className="bg-accent-rose rounded-r-full transition-all" style={{ width: `${session.bearish}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-1">
                  <span className="text-accent-green">{session.bullish}% yes</span>
                  <span>{session.neutral}% neutral</span>
                  <span className="text-accent-rose">{session.bearish}% no</span>
                </div>
              </button>

              {/* Expert opinions */}
              <AnimatePresence>
                {isOpen && !session.isPremium && session.opinions.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="border-t border-border overflow-hidden">
                    <div className="p-4 space-y-4">
                      {session.opinions.map(op => {
                        const opCfg = SENTIMENT_CONFIG[op.sentiment];
                        return (
                          <div key={op.id} className="flex gap-3">
                            <Avatar src={op.expert.avatar} alt={op.expert.displayName} size="sm" />
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <span className="text-xs font-semibold text-text-primary">{op.expert.displayName}</span>
                                <BadgeCheck size={11} className="text-primary-light" />
                                <span className="text-[10px] text-text-muted bg-white/[0.04] px-1.5 py-0.5 rounded-full">{op.expert.credential}</span>
                                <div className={cn("flex items-center gap-1 text-[10px] font-bold ml-auto", opCfg.color)}>
                                  {opCfg.icon} {op.confidence}%
                                </div>
                              </div>
                              <p className="text-sm text-text-secondary leading-relaxed">"{op.opinion}"</p>
                              <div className="text-[10px] text-text-muted mt-1">Rep score: {op.expert.reputationScore}/100</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
                {isOpen && session.isPremium && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="border-t border-border overflow-hidden">
                    <div className="p-4 text-center">
                      <Lock size={24} className="mx-auto mb-2 text-accent-amber" />
                      <p className="text-sm font-semibold text-text-primary mb-1">Premium Intelligence Report</p>
                      <p className="text-xs text-text-muted mb-3">Get the full breakdown from {session.expertCount} experts with confidence scores, reasoning, and source citations.</p>
                      <Button variant="gradient" size="sm" className="gap-1.5" onClick={() => toast("success", "Purchase coming soon — join the waitlist!")}>
                        <Sparkles size={13} /> Unlock for ${session.priceUSD}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Request modal */}
      <AnimatePresence>
        {showRequest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setShowRequest(false)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-1">
                <Brain size={16} className="text-primary-light" />
                <h3 className="text-base font-bold text-text-primary">Ask the Brain Trust</h3>
              </div>
              <p className="text-xs text-text-muted mb-4">Your question goes to all verified experts in the relevant category. Results in 24–48 hours.</p>
              <textarea value={question} onChange={e => setQuestion(e.target.value)}
                placeholder="What would you like experts to weigh in on?" rows={4}
                className="input-base resize-none w-full mb-3" />
              <div className="text-xs text-text-muted mb-4 flex items-center gap-1.5">
                <Sparkles size={11} className="text-primary-light" />
                Public questions are free. Private reports cost $49 and include full source citations.
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowRequest(false)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" loading={requesting}
                  disabled={!question.trim()} onClick={handleRequest}>
                  Submit Free
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
