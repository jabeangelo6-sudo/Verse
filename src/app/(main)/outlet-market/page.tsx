"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Search, DollarSign, Check, Eye, BadgeCheck,
  Zap, X, FileText, Image, Video, BarChart2, Film, Newspaper,
  Plus, Globe, Lock, Send, ChevronRight, TrendingUp, Clock,
} from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn, formatCount } from "@/lib/utils";

type Tab = "browse" | "my-packages";
type Topic = "all" | "politics" | "business" | "tech" | "local" | "culture";
type Format = "all" | "investigation" | "photo-essay" | "documentary" | "data-story" | "breaking";
type Exclusivity = "all" | "exclusive" | "non-exclusive";
type Sort = "recent" | "offers" | "price-asc" | "price-desc";
type NewStep = 1 | 2 | 3;

interface StoryPackage {
  id: string;
  title: string;
  summary: string;
  journalist: { username: string; displayName: string; avatar: string; verified: boolean; bio: string };
  topic: Exclude<Topic, "all">;
  format: Exclude<Format, "all">;
  wordCount: number;
  assetCount: number;
  tags: string[];
  price: number;
  exclusivity: "exclusive" | "non-exclusive";
  createdAt: Date;
  views: number;
  offers: number;
  mediaThumb: string | null;
}

const FORMAT_META: Record<Exclude<Format, "all">, { label: string; icon: React.ReactNode; color: string }> = {
  investigation: { label: "Investigation",  icon: <FileText size={11} />, color: "text-accent-amber bg-accent-amber/10" },
  "photo-essay": { label: "Photo Essay",    icon: <Image size={11} />,    color: "text-accent-cyan bg-accent-cyan/10" },
  documentary:   { label: "Documentary",    icon: <Film size={11} />,     color: "text-accent-rose bg-accent-rose/10" },
  "data-story":  { label: "Data Story",     icon: <BarChart2 size={11} />,color: "text-accent-green bg-accent-green/10" },
  breaking:      { label: "Breaking",       icon: <Newspaper size={11} />, color: "text-primary-light bg-primary/10" },
};

const MOCK_PACKAGES: StoryPackage[] = [
  {
    id: "pk1",
    title: "The Hidden Cost of the Gig Economy: 6 Months Inside Amazon DSP",
    summary: "Deep investigation into contractor safety violations across 12 depots. Backed by 3 months of internal leak documents, on-record testimony from 8 workers, OSHA filing data (licensed dataset), and video footage from two incidents. 4,200 words, ready to publish.",
    journalist: { username: "sarah_inv", displayName: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarahc", verified: true, bio: "Investigative reporter, 8 years. Previously WSJ, The Intercept. Focused on labor and corporate accountability." },
    topic: "business", format: "investigation", wordCount: 4200, assetCount: 3,
    tags: ["amazon", "gig-economy", "labor", "osha", "investigation"],
    price: 2500, exclusivity: "exclusive",
    createdAt: new Date(Date.now() - 2 * 86400 * 1000), views: 840, offers: 4,
    mediaThumb: "https://picsum.photos/seed/amazon7/600/280",
  },
  {
    id: "pk2",
    title: "Capitol Steps: 40 Minutes of Unedited Ground-Level Footage",
    summary: "Complete visual package — 52 licensed images and 2 uncut video clips from the protest. All files geo-tagged, timestamped, and release-ready. 800-word contextual piece included. Suitable for same-day publication.",
    journalist: { username: "dc_ground", displayName: "Terrence Gray", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=terrence", verified: false, bio: "DC-based freelance photojournalist. 5 years on the Hill. Specialises in civil unrest and government." },
    topic: "politics", format: "photo-essay", wordCount: 800, assetCount: 3,
    tags: ["protest", "dc", "congress", "photo", "visual"],
    price: 1200, exclusivity: "non-exclusive",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000), views: 2100, offers: 9,
    mediaThumb: "https://picsum.photos/seed/capitol8/600/280",
  },
  {
    id: "pk3",
    title: "SVB: A Reconstructed Timeline of the 9 Days Before Collapse",
    summary: "Narrative investigation using the licensed insider account plus 3 months of public filings, regulatory correspondence, and a verified internal Slack export. 5,800 words. Two sources provided on-record. Fact-checked.",
    journalist: { username: "fin_reporter", displayName: "Aisha Oduya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha", verified: true, bio: "Financial journalist. 11 years covering banking and regulation. Ex-Bloomberg, Reuters." },
    topic: "business", format: "investigation", wordCount: 5800, assetCount: 1,
    tags: ["svb", "banking", "collapse", "finance", "exclusive"],
    price: 3800, exclusivity: "exclusive",
    createdAt: new Date(Date.now() - 4 * 86400 * 1000), views: 3400, offers: 2,
    mediaThumb: null,
  },
  {
    id: "pk4",
    title: "Border Crossing — Nogales: A Morning in 40 Photographs",
    summary: "Photo essay built on licensed high-res series from Camila Reyes. Edited selection of 40 images across 4 narrative sequences, with 600-word caption essay. Multiple publication formats available.",
    journalist: { username: "border_desk", displayName: "Marco Villanueva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marco", verified: true, bio: "Border correspondent. Based in Tucson. Contributor to The Guardian, VICE, NPR." },
    topic: "politics", format: "photo-essay", wordCount: 600, assetCount: 1,
    tags: ["border", "immigration", "photos", "arizona"],
    price: 900, exclusivity: "non-exclusive",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000), views: 5600, offers: 14,
    mediaThumb: "https://picsum.photos/seed/desert12/600/280",
  },
  {
    id: "pk5",
    title: "The Pay Gap They Don't Want Published: A Data Investigation",
    summary: "Full data story using licensed salary leak from a Fortune 100 firm. Includes regression analysis, visualisation-ready charts, methodology notes, and a 2,400-word narrative. Independently verified by a second source.",
    journalist: { username: "databeat", displayName: "Priya Rajan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya2", verified: true, bio: "Data journalist. Specialises in corporate accountability and labour economics. MSc Statistics, LSE." },
    topic: "business", format: "data-story", wordCount: 2400, assetCount: 1,
    tags: ["pay-gap", "corporate", "data", "gender", "race"],
    price: 1800, exclusivity: "exclusive",
    createdAt: new Date(Date.now() - 30 * 3600 * 1000), views: 1900, offers: 3,
    mediaThumb: null,
  },
  {
    id: "pk6",
    title: "Detroit Fire: First Verified Account with Raw Footage",
    summary: "Breaking news package. Licensed 17-second raw video of the east wall collapse plus on-scene reporting filed within 90 minutes. First confirmed eyewitness account with supporting visual evidence.",
    journalist: { username: "miriam_w", displayName: "Miriam Weiss", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miriam", verified: false, bio: "Local reporter, Detroit. Covered city hall and public safety for 4 years." },
    topic: "local", format: "breaking", wordCount: 600, assetCount: 1,
    tags: ["breaking", "fire", "detroit", "video"],
    price: 350, exclusivity: "non-exclusive",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000), views: 12000, offers: 22,
    mediaThumb: "https://picsum.photos/seed/fire11/600/280",
  },
  {
    id: "pk7",
    title: "Cook County Police Overtime: A Four-Year Pattern",
    summary: "Data story built on licensed FOIA dataset. 48,000 rows analysed. Interactive-ready charts showing overtime spikes correlating with protest dates. 1,800-word explainer. Embed-ready visualisations included.",
    journalist: { username: "opengov_felix", displayName: "Felix Huang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=felix", verified: true, bio: "Civic data reporter. FOIA practitioner. Based in Chicago. Open-source tools contributor." },
    topic: "politics", format: "data-story", wordCount: 1800, assetCount: 1,
    tags: ["police", "chicago", "foia", "data", "accountability"],
    price: 1100, exclusivity: "non-exclusive",
    createdAt: new Date(Date.now() - 2 * 86400 * 1000), views: 3200, offers: 7,
    mediaThumb: null,
  },
];

function timeAgoShort(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export default function OutletMarketPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>("browse");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic>("all");
  const [format, setFormat] = useState<Format>("all");
  const [exclusivity, setExclusivity] = useState<Exclusivity>("all");
  const [sort, setSort] = useState<Sort>("recent");

  const [selectedPkg, setSelectedPkg] = useState<StoryPackage | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNote, setOfferNote] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [sentOffers, setSentOffers] = useState<Set<string>>(new Set());
  const [boughtPkgs, setBoughtPkgs] = useState<Set<string>>(new Set());

  // New package creation
  const [showNew, setShowNew] = useState(false);
  const [newStep, setNewStep] = useState<NewStep>(1);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newTopic, setNewTopic] = useState<Exclude<Topic, "all">>("politics");
  const [newFormat, setNewFormat] = useState<Exclude<Format, "all">>("investigation");
  const [newPrice, setNewPrice] = useState("");
  const [newExclusivity, setNewExclusivity] = useState<"exclusive" | "non-exclusive">("non-exclusive");
  const [publishing, setPublishing] = useState(false);
  const [myPackages, setMyPackages] = useState<StoryPackage[]>([]);

  const filtered = MOCK_PACKAGES.filter(p => {
    if (topic !== "all" && p.topic !== topic) return false;
    if (format !== "all" && p.format !== format) return false;
    if (exclusivity !== "all" && p.exclusivity !== exclusivity) return false;
    if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.summary.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "offers") return b.offers - a.offers;
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const handleOffer = async () => {
    setSubmittingOffer(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmittingOffer(false);
    if (selectedPkg) {
      setSentOffers(prev => new Set([...prev, selectedPkg.id]));
      setShowOffer(false);
      setSelectedPkg(null);
      setOfferAmount("");
      setOfferNote("");
      toast("success", "Offer sent", "The journalist will respond within 48 hours");
    }
  };

  const handleBuyNow = async (pkg: StoryPackage) => {
    await new Promise(r => setTimeout(r, 1200));
    setBoughtPkgs(prev => new Set([...prev, pkg.id]));
    setSelectedPkg(null);
    toast("success", "Package purchased", "Files and license cert sent to your email");
  };

  const handlePublish = async () => {
    if (!newTitle.trim() || !newSummary.trim() || !newPrice) return;
    setPublishing(true);
    await new Promise(r => setTimeout(r, 1500));
    setPublishing(false);
    const pkg: StoryPackage = {
      id: `my-${Date.now()}`,
      title: newTitle,
      summary: newSummary,
      journalist: { username: user?.username ?? "you", displayName: user?.displayName ?? "You", avatar: user?.avatar ?? "", verified: user?.verified ?? false, bio: user?.bio ?? "" },
      topic: newTopic, format: newFormat, wordCount: 0, assetCount: 0,
      tags: [], price: parseInt(newPrice) || 0, exclusivity: newExclusivity,
      createdAt: new Date(), views: 0, offers: 0, mediaThumb: null,
    };
    setMyPackages(prev => [pkg, ...prev]);
    setShowNew(false);
    setNewStep(1); setNewTitle(""); setNewSummary(""); setNewPrice("");
    setTab("my-packages");
    toast("success", "Package listed on the outlet marketplace");
  };

  const fmtPrice = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Outlet Marketplace" />

      {/* Tabs */}
      <div className="sticky top-14 z-20 glass-nav border-b border-border px-4">
        <div className="flex gap-1">
          {([
            { id: "browse" as Tab, label: "Browse Packages" },
            { id: "my-packages" as Tab, label: myPackages.length > 0 ? `My Packages (${myPackages.length})` : "My Packages" },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("px-3 py-3 text-sm font-medium transition-all relative",
                tab === t.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary")}>
              {t.label}
              {tab === t.id && <motion.div layoutId="outlet-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── BROWSE ─────────────────────────────── */}
        {tab === "browse" && (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4">

            {/* Search */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input placeholder="Search story packages..." value={query} onChange={e => setQuery(e.target.value)}
                className="input-base pl-9" />
            </div>

            {/* Filters row */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2">
              {(["all", "politics", "business", "tech", "local", "culture"] as Topic[]).map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 border transition-all capitalize",
                    topic === t ? "bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan" : "border-border text-text-muted hover:border-border-strong")}>
                  {t === "all" ? "All topics" : t}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2">
              {(["all", "investigation", "photo-essay", "documentary", "data-story", "breaking"] as Format[]).map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 border transition-all",
                    format === f ? "bg-primary/15 border-primary/30 text-primary-light" : "border-border text-text-muted hover:border-border-strong")}>
                  {f === "all" ? "All formats" : FORMAT_META[f as Exclude<Format, "all">].label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {([["all", "Any rights"], ["exclusive", "Exclusive only"], ["non-exclusive", "Non-exclusive"]] as [Exclusivity, string][]).map(([v, label]) => (
                  <button key={v} onClick={() => setExclusivity(v)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 border transition-all",
                      exclusivity === v ? "bg-accent-amber/15 border-accent-amber/30 text-accent-amber" : "border-border text-text-muted hover:border-border-strong")}>
                    {label}
                  </button>
                ))}
              </div>
              <select value={sort} onChange={e => setSort(e.target.value as Sort)}
                className="ml-auto flex-shrink-0 text-xs bg-white/[0.04] border border-border rounded-xl px-2 py-1.5 text-text-muted">
                <option value="recent">Newest</option>
                <option value="offers">Most offers</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>
            </div>

            {/* Package cards */}
            <div className="space-y-4 pb-4">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-text-muted">
                  <Package size={28} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No packages match your filters</p>
                </div>
              )}
              {filtered.map((pkg, i) => {
                const fm = FORMAT_META[pkg.format];
                const bought = boughtPkgs.has(pkg.id);
                const offered = sentOffers.has(pkg.id);
                return (
                  <motion.div key={pkg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }} className="card p-4 cursor-pointer hover:border-border-strong transition-colors"
                    onClick={() => setSelectedPkg(pkg)}>

                    {pkg.mediaThumb && (
                      <div className="relative mb-3 rounded-xl overflow-hidden h-36 bg-white/[0.04]">
                        <img src={pkg.mediaThumb} alt="" className="w-full h-full object-cover opacity-70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold", fm.color)}>
                        {fm.icon} {fm.label}
                      </span>
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                        pkg.exclusivity === "exclusive" ? "text-accent-rose bg-accent-rose/10" : "text-text-muted bg-white/[0.06]")}>
                        {pkg.exclusivity === "exclusive" ? <><Lock size={9} /> Exclusive</> : <><Globe size={9} /> Non-exclusive</>}
                      </span>
                      <span className="text-[10px] text-text-muted ml-auto">{timeAgoShort(pkg.createdAt)}</span>
                    </div>

                    <h3 className="text-sm font-bold text-text-primary leading-snug mb-1.5">{pkg.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-2">{pkg.summary}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Avatar src={pkg.journalist.avatar} alt={pkg.journalist.displayName} size="xs" />
                      <span className="text-xs text-text-muted">
                        {pkg.journalist.displayName}
                        {pkg.journalist.verified && <BadgeCheck size={10} className="inline ml-1 text-primary-light" />}
                      </span>
                      <span className="text-text-muted text-xs">·</span>
                      <span className="text-xs text-text-muted">{pkg.wordCount.toLocaleString()} words</span>
                      <span className="text-text-muted text-xs">·</span>
                      <span className="text-xs text-text-muted">{pkg.assetCount} licensed source{pkg.assetCount !== 1 ? "s" : ""}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-text-primary">{fmtPrice(pkg.price)}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-muted flex items-center gap-1"><Eye size={9} /> {formatCount(pkg.views)}</span>
                          <span className="text-[10px] text-accent-amber font-semibold">{pkg.offers} offers</span>
                        </div>
                      </div>
                      {bought ? (
                        <span className="text-xs text-accent-green font-semibold flex items-center gap-1"><Check size={12} /> Purchased</span>
                      ) : offered ? (
                        <span className="text-xs text-accent-cyan font-semibold flex items-center gap-1"><Check size={12} /> Offer sent</span>
                      ) : (
                        <Button variant="primary" size="sm" onClick={e => { e.stopPropagation(); setSelectedPkg(pkg); }}
                          className="gap-1.5">
                          {pkg.exclusivity === "exclusive" ? "Make offer" : "Buy now"}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── MY PACKAGES ──────────────────────────── */}
        {tab === "my-packages" && (
          <motion.div key="my-packages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4">
            <Button variant="primary" size="sm" className="w-full gap-2 mb-4" onClick={() => setShowNew(true)}>
              <Plus size={15} /> List a story package
            </Button>

            {myPackages.length === 0 ? (
              <div className="text-center py-12">
                <Package size={36} className="mx-auto mb-3 text-text-muted opacity-30" />
                <p className="text-sm font-medium text-text-secondary mb-1">No packages yet</p>
                <p className="text-xs text-text-muted mb-1">License creator content from the</p>
                <Link href="/licensing" className="text-xs text-primary-light hover:underline">
                  Content Licensing page →
                </Link>
                <p className="text-xs text-text-muted mt-3 max-w-xs mx-auto">
                  Then package your reporting and licensed sources here to sell to outlets and brands.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {myPackages.map(pkg => {
                  const fm = FORMAT_META[pkg.format];
                  return (
                    <div key={pkg.id} className="card p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold", fm.color)}>
                          {fm.icon} {fm.label}
                        </span>
                        <span className="text-[10px] text-accent-green font-bold bg-accent-green/10 px-2 py-0.5 rounded-full">Listed</span>
                      </div>
                      <h3 className="text-sm font-bold text-text-primary mb-1 leading-snug">{pkg.title}</h3>
                      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{pkg.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-text-primary">{fmtPrice(pkg.price)}</span>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span className="flex items-center gap-1"><Eye size={11} /> {pkg.views}</span>
                          <span className="flex items-center gap-1 text-accent-amber font-semibold">{pkg.offers} offers</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PACKAGE DETAIL MODAL ─────────────────── */}
      <AnimatePresence>
        {selectedPkg && !showOffer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setSelectedPkg(null)}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full md:max-w-xl bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {selectedPkg.mediaThumb && (
                <div className="relative h-44 overflow-hidden rounded-t-3xl md:rounded-t-2xl">
                  <img src={selectedPkg.mediaThumb} alt="" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated to-transparent" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold", FORMAT_META[selectedPkg.format].color)}>
                    {FORMAT_META[selectedPkg.format].icon} {FORMAT_META[selectedPkg.format].label}
                  </span>
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                    selectedPkg.exclusivity === "exclusive" ? "text-accent-rose bg-accent-rose/10" : "text-text-muted bg-white/[0.06]")}>
                    {selectedPkg.exclusivity === "exclusive" ? <><Lock size={9} /> Exclusive</> : <><Globe size={9} /> Non-exclusive</>}
                  </span>
                  <button onClick={() => setSelectedPkg(null)} className="ml-auto text-text-muted hover:text-text-secondary">
                    <X size={18} />
                  </button>
                </div>

                <h2 className="text-base font-bold text-text-primary mb-2 leading-snug">{selectedPkg.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{selectedPkg.summary}</p>

                {/* Package contents */}
                <div className="rounded-xl bg-white/[0.03] border border-border p-3 mb-4 space-y-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">What's included</p>
                  {[
                    [`${selectedPkg.wordCount.toLocaleString()}-word article`, <FileText key="f" size={12} className="text-text-muted" />],
                    [`${selectedPkg.assetCount} licensed creator source${selectedPkg.assetCount !== 1 ? "s" : ""}`, <Package key="p" size={12} className="text-text-muted" />],
                    ["Full license certificate for each source", <Check key="c" size={12} className="text-accent-green" />],
                    ["Ready-to-publish files", <Check key="r" size={12} className="text-accent-green" />],
                  ].map(([label, icon]) => (
                    <div key={String(label)} className="flex items-center gap-2 text-xs text-text-secondary">
                      {icon} {label}
                    </div>
                  ))}
                </div>

                {/* Journalist */}
                <div className="flex items-start gap-3 mb-4 p-3 rounded-xl bg-white/[0.03] border border-border">
                  <Avatar src={selectedPkg.journalist.avatar} alt={selectedPkg.journalist.displayName} size="sm" />
                  <div>
                    <div className="text-xs font-bold text-text-primary flex items-center gap-1">
                      {selectedPkg.journalist.displayName}
                      {selectedPkg.journalist.verified && <BadgeCheck size={11} className="text-primary-light" />}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5 leading-relaxed">{selectedPkg.journalist.bio}</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {selectedPkg.tags.map(t => <Badge key={t} variant="ghost">#{t}</Badge>)}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xl font-bold text-text-primary">{fmtPrice(selectedPkg.price)}</div>
                    <div className="text-xs text-text-muted">{selectedPkg.offers} offers · {formatCount(selectedPkg.views)} views</div>
                  </div>
                  {boughtPkgs.has(selectedPkg.id) ? (
                    <span className="text-sm text-accent-green font-semibold flex items-center gap-1.5"><Check size={14} /> Purchased</span>
                  ) : sentOffers.has(selectedPkg.id) ? (
                    <span className="text-sm text-accent-cyan font-semibold flex items-center gap-1.5"><Check size={14} /> Offer sent</span>
                  ) : selectedPkg.exclusivity === "exclusive" ? (
                    <Button variant="primary" size="sm" onClick={() => setShowOffer(true)} className="gap-1.5">
                      <Send size={13} /> Make an offer
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => handleBuyNow(selectedPkg)} className="gap-1.5">
                      <DollarSign size={13} /> Buy now
                    </Button>
                  )}
                </div>
                {selectedPkg.exclusivity === "exclusive" && !sentOffers.has(selectedPkg.id) && (
                  <p className="text-[11px] text-text-muted">Exclusive packages are negotiated directly. The journalist responds within 48 hours.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAKE OFFER MODAL ─────────────────────── */}
      <AnimatePresence>
        {showOffer && selectedPkg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setShowOffer(false)}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold text-text-primary mb-0.5">Make an offer</h3>
              <p className="text-xs text-text-muted mb-4 line-clamp-1">{selectedPkg.title}</p>

              <div className="mb-3">
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Your offer</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">$</span>
                  <input type="number" placeholder={String(selectedPkg.price)} value={offerAmount}
                    onChange={e => setOfferAmount(e.target.value)}
                    className="input-base pl-7" />
                </div>
                <p className="text-[11px] text-text-muted mt-1">Listed at {fmtPrice(selectedPkg.price)}</p>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Message to journalist <span className="text-text-muted font-normal">(optional)</span></label>
                <textarea value={offerNote} onChange={e => setOfferNote(e.target.value)}
                  placeholder="Tell them about your outlet, intended use, or timeline..."
                  rows={3} className="input-base resize-none" />
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowOffer(false)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" loading={submittingOffer}
                  onClick={handleOffer} disabled={!offerAmount}>
                  Send offer {offerAmount ? `· $${offerAmount}` : ""}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NEW PACKAGE MODAL ────────────────────── */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => { setShowNew(false); setNewStep(1); }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>

              {/* Step header */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-muted">Step {newStep} of 3</span>
                <button onClick={() => { setShowNew(false); setNewStep(1); }} className="text-text-muted hover:text-text-secondary"><X size={18} /></button>
              </div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3].map(s => (
                  <div key={s} className={cn("h-0.5 flex-1 rounded-full transition-colors", s <= newStep ? "bg-primary" : "bg-white/[0.08]")} />
                ))}
              </div>

              {newStep === 1 && (
                <>
                  <h3 className="text-base font-bold text-text-primary mb-4">Package details</h3>
                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="text-xs font-semibold text-text-secondary block mb-1.5">Story title</label>
                      <input placeholder="A strong, specific headline..." value={newTitle}
                        onChange={e => setNewTitle(e.target.value)} className="input-base" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-secondary block mb-1.5">Summary for outlets</label>
                      <textarea placeholder="What's the story? What sources and assets are included? Why now?" value={newSummary}
                        onChange={e => setNewSummary(e.target.value)} rows={4} className="input-base resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-secondary block mb-1.5">Topic</label>
                      <div className="flex flex-wrap gap-2">
                        {(["politics", "business", "tech", "local", "culture"] as Exclude<Topic, "all">[]).map(t => (
                          <button key={t} onClick={() => setNewTopic(t)}
                            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize",
                              newTopic === t ? "bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan" : "border-border text-text-muted")}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" className="w-full" disabled={!newTitle || !newSummary}
                    onClick={() => setNewStep(2)}>
                    Continue <ChevronRight size={14} className="ml-1" />
                  </Button>
                </>
              )}

              {newStep === 2 && (
                <>
                  <h3 className="text-base font-bold text-text-primary mb-4">Pricing & rights</h3>
                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="text-xs font-semibold text-text-secondary block mb-1.5">Format</label>
                      <div className="flex flex-wrap gap-2">
                        {(["investigation", "photo-essay", "documentary", "data-story", "breaking"] as Exclude<Format, "all">[]).map(f => (
                          <button key={f} onClick={() => setNewFormat(f)}
                            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                              newFormat === f ? "bg-primary/15 border-primary/30 text-primary-light" : "border-border text-text-muted")}>
                            {FORMAT_META[f].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-secondary block mb-1.5">Your price</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                        <input type="number" placeholder="e.g. 1500" value={newPrice}
                          onChange={e => setNewPrice(e.target.value)} className="input-base pl-7" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-secondary block mb-2">Exclusivity</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([["non-exclusive", "Non-exclusive", "Any outlet can buy at listed price", <Globe key="g" size={14} />],
                           ["exclusive", "Exclusive", "One outlet gets it — negotiated offer", <Lock key="l" size={14} />]] as const).map(([val, label, desc, icon]) => (
                          <button key={val} onClick={() => setNewExclusivity(val)}
                            className={cn("p-3 rounded-xl border text-left transition-all",
                              newExclusivity === val ? "border-primary/40 bg-primary/8" : "border-border hover:border-border-strong")}>
                            <div className={cn("mb-1", newExclusivity === val ? "text-primary-light" : "text-text-muted")}>{icon}</div>
                            <div className="text-xs font-semibold text-text-primary">{label}</div>
                            <div className="text-[10px] text-text-muted leading-tight mt-0.5">{desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setNewStep(1)}>Back</Button>
                    <Button variant="primary" size="sm" className="flex-1" disabled={!newPrice} onClick={() => setNewStep(3)}>
                      Review <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </>
              )}

              {newStep === 3 && (
                <>
                  <h3 className="text-base font-bold text-text-primary mb-4">Review & publish</h3>
                  <div className="rounded-xl bg-white/[0.03] border border-border p-4 mb-4 space-y-2.5">
                    {[
                      ["Title", newTitle],
                      ["Topic", newTopic],
                      ["Format", FORMAT_META[newFormat].label],
                      ["Price", `$${parseInt(newPrice || "0").toLocaleString()}`],
                      ["Rights", newExclusivity === "exclusive" ? "Exclusive (offers only)" : "Non-exclusive (buy now)"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span className="text-text-muted">{label}</span>
                        <span className="font-semibold text-text-primary capitalize">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mb-4 leading-relaxed">
                    By listing, you confirm you hold valid licenses for all creator content included, and that your reporting is original work ready for publication.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setNewStep(2)}>Back</Button>
                    <Button variant="primary" size="sm" className="flex-1" loading={publishing} onClick={handlePublish}>
                      Publish package
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
