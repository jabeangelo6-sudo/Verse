"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, Lock, BadgeCheck, AlertTriangle, ChevronDown, Send, Flame } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Category = "medical" | "legal" | "finance" | "tech" | "government";
type Credential = "MD" | "JD" | "PhD" | "CPA" | "CFA" | "Engineer" | "Government";

interface WhistlePost {
  id: string;
  credential: Credential;
  zkProof: string;
  content: string;
  category: Category;
  stakeAmount: number;
  verificationCount: number;
  credibilityScore: number;
  createdAt: Date;
  isHot: boolean;
}

const CATEGORY_CONFIG: Record<Category, { label: string; color: string; bg: string }> = {
  medical: { label: "Medical", color: "text-accent-rose", bg: "bg-accent-rose/10" },
  legal: { label: "Legal", color: "text-accent-amber", bg: "bg-accent-amber/10" },
  finance: { label: "Finance", color: "text-accent-green", bg: "bg-accent-green/10" },
  tech: { label: "Technology", color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
  government: { label: "Government", color: "text-primary-light", bg: "bg-primary/10" },
};

const CREDENTIAL_OPTIONS: Credential[] = ["MD", "JD", "PhD", "CPA", "CFA", "Engineer", "Government"];

const MOCK_POSTS: WhistlePost[] = [
  {
    id: "1",
    credential: "MD",
    zkProof: "zk:3f7a2b9c1e4d8f0a5b6c7d2e1f3a4b5c",
    content: "Three major hospital networks are suppressing data showing their AI diagnostic tools have a 34% false-positive rate for certain cancer markers. Patients are receiving unnecessary chemotherapy. I have the internal audit report.",
    category: "medical",
    stakeAmount: 500,
    verificationCount: 23,
    credibilityScore: 94,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isHot: true,
  },
  {
    id: "2",
    credential: "CFA",
    zkProof: "zk:9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a",
    content: "A major exchange is front-running large institutional orders. I've documented 847 instances over 6 months where the timing pattern is statistically impossible without inside knowledge. The data is on IPFS.",
    category: "finance",
    stakeAmount: 1000,
    verificationCount: 41,
    credibilityScore: 97,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isHot: true,
  },
  {
    id: "3",
    credential: "Engineer",
    zkProof: "zk:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    content: "The autonomous vehicle system being deployed in 3 cities has a known edge case in heavy rain at intersections that causes braking failure. It's been internally flagged 14 months ago. No recall has been issued.",
    category: "tech",
    stakeAmount: 750,
    verificationCount: 67,
    credibilityScore: 91,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    isHot: false,
  },
];

export default function WhistlePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCompose, setShowCompose] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<Credential>("MD");
  const [selectedCategory, setSelectedCategory] = useState<Category>("medical");
  const [content, setContent] = useState("");
  const [stakeAmount, setStakeAmount] = useState("100");
  const [submitting, setSubmitting] = useState(false);
  const [showProofs, setShowProofs] = useState<Set<string>>(new Set());

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (!user) { toast("warning", "You must be verified to use Whistleblower"); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setShowCompose(false);
    setContent("");
    toast("success", "Verified leak published — your identity is protected by ZK proof");
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Verified Leaks" />

      {/* Hero */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-accent-rose/15 via-primary/10 to-bg-elevated border border-accent-rose/20 p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-accent-rose" />
            <span className="text-sm font-bold text-accent-rose">Anonymous. Verified. On-chain.</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            Professionals expose wrongdoing anonymously using ZK proofs of their credentials. Your identity is never revealed — only your qualifications are verified.
          </p>
          <div className="flex gap-1 flex-wrap">
            {["Whistleblower protection", "ZK credential proof", "Reputation stake"].map(tag => (
              <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-white/[0.06] text-text-muted border border-white/[0.08]">{tag}</span>
            ))}
          </div>
        </div>

        <button onClick={() => setShowCompose(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-accent-rose/30 bg-white/[0.02] hover:bg-accent-rose/5 transition-all mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent-rose/10 flex items-center justify-center">
            <Lock size={14} className="text-accent-rose" />
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-text-primary">Submit Verified Leak</div>
            <div className="text-xs text-text-muted">ZK proof protects your identity</div>
          </div>
          <Shield size={14} className="text-text-muted" />
        </button>
      </div>

      {/* Feed */}
      <div className="px-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={14} className="text-accent-rose" />
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Verified disclosures</h2>
        </div>

        {MOCK_POSTS.map((post, i) => {
          const catCfg = CATEGORY_CONFIG[post.category];
          const isProofVisible = showProofs.has(post.id);
          return (
            <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} className="card p-4">

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                    <EyeOff size={14} className="text-text-muted" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-text-primary">Anonymous {post.credential}</span>
                      <BadgeCheck size={12} className="text-primary-light" />
                    </div>
                    <div className="text-[10px] text-text-muted">ZK-verified credential · {timeAgo(post.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {post.isHot && <Flame size={12} className="text-accent-rose fill-accent-rose" />}
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", catCfg.bg, catCfg.color)}>
                    {catCfg.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-text-primary leading-relaxed mb-3">{post.content}</p>

              {/* ZK Proof */}
              <button onClick={() => setShowProofs(prev => { const s = new Set(prev); isProofVisible ? s.delete(post.id) : s.add(post.id); return s; })}
                className="flex items-center gap-1.5 text-[10px] text-text-muted hover:text-text-secondary transition-colors mb-3">
                <Shield size={10} /> ZK Proof
                <ChevronDown size={10} className={cn("transition-transform", isProofVisible && "rotate-180")} />
              </button>
              {isProofVisible && (
                <div className="text-[10px] font-mono text-accent-green bg-accent-green/5 border border-accent-green/15 rounded-lg px-3 py-2 mb-3 break-all">
                  {post.zkProof}
                </div>
              )}

              {/* Footer stats */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><BadgeCheck size={11} className="text-accent-green" /> {post.verificationCount} verified</span>
                  <span>Credibility: <span className="text-text-primary font-semibold">{post.credibilityScore}/100</span></span>
                </div>
                <div className="flex items-center gap-1 text-xs text-accent-amber font-bold">
                  <AlertTriangle size={11} /> ${post.stakeAmount} staked
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Compose sheet */}
      <AnimatePresence>
        {showCompose && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setShowCompose(false)}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-accent-rose" />
                <h3 className="text-base font-bold text-text-primary">Anonymous Disclosure</h3>
              </div>
              <p className="text-xs text-text-muted mb-4">Your ZK proof verifies your credential without revealing who you are.</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Your credential</label>
                  <div className="flex gap-2 flex-wrap">
                    {CREDENTIAL_OPTIONS.map(c => (
                      <button key={c} onClick={() => setSelectedCredential(c)}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                          selectedCredential === c ? "bg-primary/15 border-primary/30 text-primary-light" : "border-border text-text-muted hover:border-border-strong")}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block">Category</label>
                  <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as Category)}
                    className="input-base w-full">
                    {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block">Disclosure</label>
                  <textarea value={content} onChange={e => setContent(e.target.value)} rows={5}
                    placeholder="Describe the wrongdoing, evidence, and any public interest impact..." className="input-base resize-none w-full" />
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-1 block">Reputation stake (USD) — proves you believe this</label>
                  <input type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)}
                    className="input-base w-full" min="10" />
                </div>
              </div>

              <div className="bg-accent-rose/5 border border-accent-rose/15 rounded-xl p-3 mb-4 text-xs text-text-muted flex items-start gap-2">
                <AlertTriangle size={12} className="text-accent-rose flex-shrink-0 mt-0.5" />
                False disclosures result in loss of staked amount and permanent reputation penalty.
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowCompose(false)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" loading={submitting}
                  disabled={!content.trim()} onClick={handleSubmit}>
                  <Send size={13} /> Publish Anonymously
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
