"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, DollarSign, Shield, Check, Search, BookOpen, Newspaper, Megaphone, Tv } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

type LicenseType = "blog" | "news" | "commercial" | "broadcast";

interface LicenseTier {
  id: LicenseType;
  label: string;
  price: number;
  icon: React.ReactNode;
  description: string;
  includes: string[];
}

interface LicensablePost {
  id: string;
  content: string;
  creator: { username: string; displayName: string; avatar: string; verified: boolean };
  views: number;
  licenses: number;
  tags: string[];
  createdAt: Date;
}

const LICENSE_TIERS: LicenseTier[] = [
  {
    id: "blog",
    label: "Blog / Newsletter",
    price: 9,
    icon: <BookOpen size={16} />,
    description: "Personal blog or newsletter use",
    includes: ["Single post use", "Attribution required", "Online only"],
  },
  {
    id: "news",
    label: "News / Media",
    price: 49,
    icon: <Newspaper size={16} />,
    description: "Editorial and journalism use",
    includes: ["News article use", "Attribution required", "Print + digital"],
  },
  {
    id: "commercial",
    label: "Commercial",
    price: 199,
    icon: <Megaphone size={16} />,
    description: "Brand and marketing campaigns",
    includes: ["Unlimited commercial use", "No attribution required", "All channels"],
  },
  {
    id: "broadcast",
    label: "Broadcast / Film",
    price: 499,
    icon: <Tv size={16} />,
    description: "TV, film, and streaming use",
    includes: ["Broadcast rights", "Worldwide", "Perpetual license"],
  },
];

const MOCK_POSTS: LicensablePost[] = [
  {
    id: "1",
    content: "The biggest misconception about Web3: people think it's about speculation. It's actually about ownership. For the first time in history, digital objects can be truly scarce and truly yours.",
    creator: { username: "solana_sage", displayName: "Sage Rivera", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sage", verified: true },
    views: 284000,
    licenses: 12,
    tags: ["web3", "ownership"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    content: "I quit my $400k/yr job at Google to build on-chain. Here's what I learned after 18 months: the freedom is real, but so is the loneliness. Nobody tells you about the loneliness.",
    creator: { username: "techrebel", displayName: "Alex Okonkwo", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex", verified: false },
    views: 1200000,
    licenses: 34,
    tags: ["startup", "career", "web3"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    content: "DeFi will eat traditional finance the same way email ate physical mail. Not all at once. Not obviously. Then suddenly, irreversibly, completely.",
    creator: { username: "defi_oracle", displayName: "Priya Nair", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", verified: true },
    views: 540000,
    licenses: 8,
    tags: ["defi", "finance", "prediction"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export default function LicensingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<LicensablePost | null>(null);
  const [selectedTier, setSelectedTier] = useState<LicenseType>("blog");
  const [licensing, setLicensing] = useState(false);
  const [licensed, setLicensed] = useState<Set<string>>(new Set());

  const filtered = query
    ? MOCK_POSTS.filter(p => p.content.toLowerCase().includes(query.toLowerCase()) || p.creator.username.includes(query.toLowerCase()))
    : MOCK_POSTS;

  const handleLicense = async () => {
    if (!user) { toast("warning", "Sign in to license content"); return; }
    setLicensing(true);
    await new Promise(r => setTimeout(r, 1400));
    setLicensing(false);
    if (selectedPost) {
      setLicensed(prev => new Set([...prev, selectedPost.id + selectedTier]));
      toast("success", "License granted — use it anywhere you want");
      setSelectedPost(null);
    }
  };

  const tier = LICENSE_TIERS.find(t => t.id === selectedTier)!;

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Content Licensing" />

      {/* Hero */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-accent-cyan/20 via-primary/10 to-accent-green/10 border border-accent-cyan/20 p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-accent-cyan" />
            <span className="text-sm font-bold text-accent-cyan">License any post, instantly</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Journalists, brands, and researchers pay creators directly to use their content. On-chain receipts. No middlemen.
          </p>
          <div className="flex gap-4">
            {[["$9", "Blog license"], ["$49", "News license"], ["$199", "Commercial"], ["$499", "Broadcast"]].map(([price, label]) => (
              <div key={label} className="flex-1 text-center">
                <div className="text-sm font-bold text-text-primary">{price}</div>
                <div className="text-[10px] text-text-muted leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Search content to license..." value={query}
            onChange={e => setQuery(e.target.value)} className="input-base pl-9" />
        </div>
      </div>

      {/* My licenses */}
      <div className="px-4 mb-4">
        <h2 className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Your licenses</h2>
        {licensed.size === 0 ? (
          <div className="card p-3 text-center">
            <p className="text-xs text-text-muted">No licenses yet — browse content below</p>
          </div>
        ) : (
          <div className="text-xs text-accent-green">✓ {licensed.size} active license{licensed.size > 1 ? "s" : ""}</div>
        )}
      </div>

      {/* Content grid */}
      <div className="px-4">
        <h2 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Trending licensable content</h2>
        <div className="space-y-3">
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} className="card p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <Avatar src={post.creator.avatar} alt={post.creator.displayName} size="sm" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-text-primary">{post.creator.displayName}</span>
                  <span className="text-xs text-text-muted ml-1">@{post.creator.username}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <FileText size={11} /> {post.licenses} licensed
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-3 italic">"{post.content}"</p>

              <div className="flex gap-1.5 mb-3 flex-wrap">
                {post.tags.map(t => <Badge key={t} variant="ghost">#{t}</Badge>)}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-text-muted">
                  {(post.views / 1000).toFixed(0)}K views
                </div>
                <Button variant="primary" size="sm" onClick={() => setSelectedPost(post)}
                  className="gap-1.5">
                  <DollarSign size={11} /> License from $9
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* License modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setSelectedPost(null)}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold text-text-primary mb-1">Choose a license</h3>
              <p className="text-xs text-text-muted mb-4 italic line-clamp-2">"{selectedPost.content.slice(0, 100)}…"</p>

              <div className="space-y-2 mb-4">
                {LICENSE_TIERS.map(t => (
                  <button key={t.id} onClick={() => setSelectedTier(t.id)}
                    className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      selectedTier === t.id ? "border-primary/40 bg-primary/8" : "border-border hover:border-border-strong")}>
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      selectedTier === t.id ? "bg-primary/20 text-primary-light" : "bg-white/[0.04] text-text-muted")}>
                      {t.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text-primary">{t.label}</span>
                        <span className="text-sm font-bold text-accent-amber">${t.price}</span>
                      </div>
                      <div className="text-xs text-text-muted">{t.description}</div>
                    </div>
                    {selectedTier === t.id && <Check size={14} className="text-primary-light flex-shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="bg-white/[0.03] rounded-xl p-3 mb-4 text-xs text-text-muted space-y-1">
                {tier.includes.map(item => (
                  <div key={item} className="flex items-center gap-1.5"><Check size={10} className="text-accent-green" /> {item}</div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedPost(null)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={handleLicense} loading={licensing}>
                  Pay ${tier.price} · License
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
