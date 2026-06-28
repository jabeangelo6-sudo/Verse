"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, DollarSign, Shield, Check, Search, BookOpen, Newspaper, Megaphone, Tv, Video, BarChart2, Filter, Download, Package, Eye, BadgeCheck, Zap, ChevronRight, X, Image, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn, formatCount } from "@/lib/utils";

type LicenseType = "blog" | "news" | "commercial" | "broadcast";
type Format = "all" | "text" | "photo" | "video" | "data";
type Topic = "all" | "politics" | "business" | "tech" | "local" | "culture";
type Tab = "discover" | "licenses";

interface LicensablePiece {
  id: string;
  format: Exclude<Format, "all">;
  headline: string;
  content: string;
  creator: { username: string; displayName: string; avatar: string; verified: boolean };
  topic: Exclude<Topic, "all">;
  views: number;
  licenses: number;
  tags: string[];
  createdAt: Date;
  exclusive: boolean;
  commercialCleared: boolean;
  mediaThumb: string | null;
}

interface LicenseTier {
  id: LicenseType;
  label: string;
  price: number;
  icon: React.ReactNode;
  description: string;
  includes: string[];
}

const LICENSE_TIERS: LicenseTier[] = [
  { id: "blog", label: "Blog / Newsletter", price: 9, icon: <BookOpen size={16} />, description: "Personal blog or newsletter use", includes: ["Single publication use", "Attribution required", "Online only"] },
  { id: "news", label: "News / Editorial", price: 49, icon: <Newspaper size={16} />, description: "Journalism and editorial use", includes: ["Editorial use, any outlet", "Attribution required", "Print + digital"] },
  { id: "commercial", label: "Commercial", price: 199, icon: <Megaphone size={16} />, description: "Brand and marketing use", includes: ["Unlimited commercial use", "No attribution required", "All channels"] },
  { id: "broadcast", label: "Broadcast / Streaming", price: 499, icon: <Tv size={16} />, description: "TV, film, and streaming platforms", includes: ["Broadcast rights worldwide", "Perpetual license", "All platforms"] },
];

const FORMAT_COLORS: Record<Exclude<Format, "all">, string> = {
  text:  "text-text-secondary bg-white/[0.06]",
  photo: "text-accent-cyan bg-accent-cyan/10",
  video: "text-accent-rose bg-accent-rose/10",
  data:  "text-accent-green bg-accent-green/10",
};

const FORMAT_ICONS: Record<Exclude<Format, "all">, React.ReactNode> = {
  text:  <FileText size={11} />,
  photo: <Image size={11} />,
  video: <Video size={11} />,
  data:  <BarChart2 size={11} />,
};

const MOCK_CONTENT: LicensablePiece[] = [
  {
    id: "l1", format: "video",
    headline: "Raw footage: warehouse fire spreads to adjacent block",
    content: "17-second clip from fire escape, 3rd floor. Clear view of east wall collapse. Timestamped 22:14. Audio intact. No edits.",
    creator: { username: "miriam_w", displayName: "Miriam Weiss", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miriam", verified: false },
    topic: "local", views: 84000, licenses: 3, tags: ["breaking", "fire", "detroit"],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000), exclusive: false, commercialCleared: false,
    mediaThumb: "https://picsum.photos/seed/fire9/600/300",
  },
  {
    id: "l2", format: "data",
    headline: "FOIA: 4 years of police overtime in Cook County",
    content: "48,000-row dataset. Overtime spiked 340% during protest months. Raw CSV + cleaned summary sheet. Source: public records request #2023-4471.",
    creator: { username: "opengov_felix", displayName: "Felix Huang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=felix", verified: true },
    topic: "politics", views: 220000, licenses: 19, tags: ["police", "foia", "chicago", "data"],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000), exclusive: false, commercialCleared: true, mediaThumb: null,
  },
  {
    id: "l3", format: "photo",
    headline: "40-image series: border crossing, Nogales AZ — this morning",
    content: "Shot over 3 hours, sunrise to 9am. Families, processing tents, National Guard presence. Full-res RAW files. GPS metadata intact.",
    creator: { username: "camila_foto", displayName: "Camila Reyes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=camila", verified: true },
    topic: "politics", views: 680000, licenses: 27, tags: ["border", "immigration", "photos"],
    createdAt: new Date(Date.now() - 5 * 3600 * 1000), exclusive: true, commercialCleared: false,
    mediaThumb: "https://picsum.photos/seed/desert7/600/300",
  },
  {
    id: "l4", format: "text",
    headline: "Insider account: what actually happened at the SVB board meeting",
    content: "Present for two key votes. Names redacted by request. First public account of decisions made between Feb 27–March 8. Source has been verified.",
    creator: { username: "banksource", displayName: "Verified Source", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=source99", verified: true },
    topic: "business", views: 1400000, licenses: 44, tags: ["svb", "banking", "exclusive", "finance"],
    createdAt: new Date(Date.now() - 3 * 86400 * 1000), exclusive: false, commercialCleared: true, mediaThumb: null,
  },
  {
    id: "l5", format: "video",
    headline: "11 minutes unedited: Capitol steps, full crowd visible",
    content: "Continuous take, no cuts. Original metadata preserved. Crowd size clearly visible from angle. Recording stopped at 11:42am due to battery.",
    creator: { username: "dc_ground", displayName: "Terrence Gray", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=terrence", verified: false },
    topic: "politics", views: 3200000, licenses: 88, tags: ["protest", "dc", "video"],
    createdAt: new Date(Date.now() - 8 * 3600 * 1000), exclusive: false, commercialCleared: false,
    mediaThumb: "https://picsum.photos/seed/crowd4/600/300",
  },
  {
    id: "l6", format: "data",
    headline: "Leaked: salary data from a Fortune 100 HR export — 2,400 rows",
    content: "Anonymized by role and department. Pay gaps by gender and race visible in raw data. Verified by two independent sources.",
    creator: { username: "equityleak", displayName: "Equity Source", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=equity", verified: true },
    topic: "business", views: 920000, licenses: 31, tags: ["pay-gap", "corporate", "data"],
    createdAt: new Date(Date.now() - 12 * 3600 * 1000), exclusive: true, commercialCleared: true, mediaThumb: null,
  },
];

function timeAgoShort(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export default function LicensingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("discover");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<Format>("all");
  const [topic, setTopic] = useState<Topic>("all");
  const [selectedPiece, setSelectedPiece] = useState<LicensablePiece | null>(null);
  const [selectedTier, setSelectedTier] = useState<LicenseType>("news");
  const [licensing, setLicensing] = useState(false);
  const [licensed, setLicensed] = useState<Map<string, { piece: LicensablePiece; tier: LicenseType; certId: string }>>(new Map());
  const [showCert, setShowCert] = useState<{ piece: LicensablePiece; tier: LicenseType; certId: string } | null>(null);

  const filtered = MOCK_CONTENT.filter(p => {
    if (format !== "all" && p.format !== format) return false;
    if (topic !== "all" && p.topic !== topic) return false;
    if (query && !p.headline.toLowerCase().includes(query.toLowerCase()) && !p.content.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const handleLicense = async () => {
    if (!user) { toast("warning", "Sign in to license content"); return; }
    setLicensing(true);
    await new Promise(r => setTimeout(r, 1400));
    setLicensing(false);
    if (selectedPiece) {
      const certId = `VSL-${Date.now().toString(36).toUpperCase()}`;
      const entry = { piece: selectedPiece, tier: selectedTier, certId };
      setLicensed(prev => new Map(prev).set(selectedPiece.id, entry));
      setSelectedPiece(null);
      setShowCert(entry);
    }
  };

  const activeTier = LICENSE_TIERS.find(t => t.id === selectedTier)!;
  const certTierLabel = LICENSE_TIERS.find(t => t.id === (showCert?.tier ?? "news"))?.label ?? "";

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Content Licensing" />

      {/* Tabs */}
      <div className="sticky top-14 z-20 glass-nav border-b border-border px-4">
        <div className="flex gap-1">
          {([
            { id: "discover" as Tab, label: "Discover" },
            { id: "licenses" as Tab, label: licensed.size > 0 ? `My Licenses (${licensed.size})` : "My Licenses" },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("px-3 py-3 text-sm font-medium transition-all relative",
                tab === t.id ? "text-text-primary" : "text-text-muted hover:text-text-secondary")}>
              {t.label}
              {tab === t.id && <motion.div layoutId="license-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── DISCOVER ─────────────────────────────── */}
        {tab === "discover" && (
          <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" placeholder="Search licensable content..." value={query}
                onChange={e => setQuery(e.target.value)} className="input-base pl-9" />
            </div>

            {/* Format chips */}
            <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar pb-1">
              {(["all", "text", "photo", "video", "data"] as Format[]).map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 border transition-all capitalize",
                    format === f ? "bg-primary/15 border-primary/30 text-primary-light" : "border-border text-text-muted hover:border-border-strong")}>
                  {f === "all" ? "All formats" : f}
                </button>
              ))}
            </div>

            {/* Topic chips */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {(["all", "politics", "business", "tech", "local", "culture"] as Topic[]).map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 border transition-all capitalize",
                    topic === t ? "bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan" : "border-border text-text-muted hover:border-border-strong")}>
                  {t === "all" ? "All topics" : t}
                </button>
              ))}
            </div>

            <div className="space-y-3 pb-4">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-text-muted">
                  <Filter size={28} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No content matches your filters</p>
                </div>
              )}
              {filtered.map((piece, i) => {
                const alreadyLicensed = licensed.has(piece.id);
                return (
                  <motion.div key={piece.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} className="card p-4">

                    <div className="flex items-center gap-2 mb-2.5">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize", FORMAT_COLORS[piece.format])}>
                        {FORMAT_ICONS[piece.format]} {piece.format}
                      </span>
                      {piece.commercialCleared ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-accent-green bg-accent-green/10">
                          <Check size={9} /> Commercial cleared
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-accent-amber bg-accent-amber/10">
                          <Lock size={9} /> Editorial only
                        </span>
                      )}
                      {piece.exclusive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-accent-amber bg-accent-amber/10">
                          <Zap size={9} className="fill-accent-amber" /> Exclusive
                        </span>
                      )}
                      <span className="text-[10px] text-text-muted ml-auto">{timeAgoShort(piece.createdAt)}</span>
                    </div>

                    {piece.mediaThumb && (
                      <div className="relative mb-2.5 rounded-xl overflow-hidden h-32 bg-white/[0.04]">
                        <img src={piece.mediaThumb} alt="" className="w-full h-full object-cover opacity-70" />
                        {piece.format === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                              <Video size={16} className="text-white ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <h3 className="text-sm font-bold text-text-primary mb-1 leading-snug">{piece.headline}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed mb-3">{piece.content}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Avatar src={piece.creator.avatar} alt={piece.creator.displayName} size="xs" />
                      <span className="text-xs text-text-muted">
                        {piece.creator.displayName}
                        {piece.creator.verified && <BadgeCheck size={10} className="inline ml-1 text-primary-light" />}
                      </span>
                      <span className="text-text-muted text-xs">·</span>
                      <span className="text-xs text-text-muted flex items-center gap-1"><Eye size={10} /> {formatCount(piece.views)}</span>
                      <span className="text-text-muted text-xs">·</span>
                      <span className="text-xs text-text-muted">{piece.licenses} licensed</span>
                    </div>

                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {piece.tags.map(t => <Badge key={t} variant="ghost">#{t}</Badge>)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">from <span className="text-accent-amber font-bold">$9</span></span>
                      {alreadyLicensed ? (
                        <button onClick={() => setShowCert(licensed.get(piece.id)!)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-accent-green hover:underline">
                          <Check size={12} /> Licensed · View cert
                        </button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => setSelectedPiece(piece)} className="gap-1.5">
                          <DollarSign size={11} /> License
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── MY LICENSES ──────────────────────────── */}
        {tab === "licenses" && (
          <motion.div key="licenses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4">
            {licensed.size === 0 ? (
              <div className="text-center py-16">
                <FileText size={36} className="mx-auto mb-3 text-text-muted opacity-30" />
                <p className="text-sm font-medium text-text-secondary mb-1">No licenses yet</p>
                <p className="text-xs text-text-muted mb-4">License creator content to use it in your reporting</p>
                <Button variant="secondary" size="sm" onClick={() => setTab("discover")}>Browse content</Button>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {[...licensed.values()].map(({ piece, tier: t, certId }) => {
                  const tierInfo = LICENSE_TIERS.find(l => l.id === t)!;
                  return (
                    <div key={certId} className="card p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize mb-1.5", FORMAT_COLORS[piece.format])}>
                            {FORMAT_ICONS[piece.format]} {piece.format}
                          </span>
                          <h3 className="text-sm font-bold text-text-primary leading-snug">{piece.headline}</h3>
                        </div>
                        <span className="text-[10px] text-accent-green font-bold bg-accent-green/10 px-2 py-0.5 rounded-full flex-shrink-0">Active</span>
                      </div>
                      <p className="text-xs text-text-muted mb-3">
                        {tierInfo.label} · <span className="font-mono text-[10px]">{certId}</span>
                      </p>
                      <div className="flex gap-3">
                        <button onClick={() => setShowCert({ piece, tier: t, certId })}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary-light hover:underline">
                          <Download size={12} /> Certificate
                        </button>
                        <button onClick={() => router.push("/outlet-market")}
                          className="flex items-center gap-1.5 text-xs font-semibold text-accent-cyan hover:underline">
                          <Package size={12} /> Package for outlet
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="card p-4 border-dashed text-center">
                  <p className="text-xs text-text-muted mb-2">
                    Bundle your licensed content into a story package and sell it directly to media outlets and brands.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => router.push("/outlet-market")}>
                    Open outlet marketplace <ChevronRight size={12} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LICENSE PURCHASE MODAL ───────────────── */}
      <AnimatePresence>
        {selectedPiece && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setSelectedPiece(null)}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold text-text-primary mb-0.5">Choose a license</h3>
              <p className="text-xs text-text-muted mb-4 line-clamp-1">{selectedPiece.headline}</p>

              {!selectedPiece.commercialCleared && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-amber/8 border border-accent-amber/20 mb-3">
                  <Lock size={12} className="text-accent-amber flex-shrink-0" />
                  <p className="text-[11px] text-accent-amber leading-snug">Commercial &amp; Broadcast require a model release. This content is available for editorial use only.</p>
                </div>
              )}
              <div className="space-y-2 mb-4">
                {LICENSE_TIERS.map(t => {
                  const locked = !selectedPiece.commercialCleared && (t.id === "commercial" || t.id === "broadcast");
                  return (
                    <button key={t.id} onClick={() => !locked && setSelectedTier(t.id)} disabled={locked}
                      className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                        locked ? "opacity-40 cursor-not-allowed border-border" :
                        selectedTier === t.id ? "border-primary/40 bg-primary/8" : "border-border hover:border-border-strong")}>
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                        locked ? "bg-white/[0.04] text-text-muted" :
                        selectedTier === t.id ? "bg-primary/20 text-primary-light" : "bg-white/[0.04] text-text-muted")}>
                        {locked ? <Lock size={14} /> : t.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-text-primary">{t.label}</span>
                          {locked ? <span className="text-xs text-text-muted">Model release required</span>
                            : <span className="text-sm font-bold text-accent-amber">${t.price}</span>}
                        </div>
                        <div className="text-xs text-text-muted">{t.description}</div>
                      </div>
                      {!locked && selectedTier === t.id && <Check size={14} className="text-primary-light flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="bg-white/[0.03] rounded-xl p-3 mb-4 space-y-1">
                {activeTier.includes.map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Check size={10} className="text-accent-green" /> {item}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedPiece(null)}>Cancel</Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={handleLicense} loading={licensing}>
                  Pay ${activeTier.price} · License
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LICENSE CERTIFICATE MODAL ────────────── */}
      <AnimatePresence>
        {showCert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setShowCert(null)}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-accent-green" />
                  <span className="text-sm font-bold text-text-primary">License Certificate</span>
                </div>
                <button onClick={() => setShowCert(null)} className="text-text-muted hover:text-text-secondary">
                  <X size={18} />
                </button>
              </div>

              <div className="rounded-xl border border-accent-green/20 bg-accent-green/5 p-4 mb-4 space-y-2.5">
                {[
                  ["Certificate ID", <span key="cert" className="font-mono font-bold text-text-primary">{showCert.certId}</span>],
                  ["License type", certTierLabel],
                  ["Content", <span key="content" className="max-w-[60%] text-right line-clamp-1">{showCert.piece.headline}</span>],
                  ["Creator", `@${showCert.piece.creator.username}`],
                  ["Permitted use", showCert.piece.commercialCleared
                    ? <span key="use" className="text-accent-green font-bold">Editorial + Commercial</span>
                    : <span key="use" className="text-accent-amber font-bold">Editorial only</span>],
                  ["Issued", new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between items-start text-xs">
                    <span className="text-text-muted flex-shrink-0">{label}</span>
                    <span className="font-semibold text-text-primary ml-4 text-right">{value}</span>
                  </div>
                ))}
                <div className="border-t border-accent-green/20 pt-2.5">
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    This certificate grants the licensee rights per the selected tier. {showCert.piece.commercialCleared ? "Commercial use is cleared per model releases on file." : "This content is licensed for editorial use only — advertising, product marketing, or commercial promotion is prohibited."} Creator retains copyright. Usage outside the licensed scope requires a new license.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1"
                  onClick={() => toast("success", "Certificate saved to downloads")}>
                  <Download size={13} className="mr-1.5" /> Download PDF
                </Button>
                <Button variant="primary" size="sm" className="flex-1"
                  onClick={() => { setShowCert(null); setTab("licenses"); }}>
                  <Package size={13} className="mr-1.5" /> My Licenses
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
