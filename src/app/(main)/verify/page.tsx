"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Upload, ChevronRight, Users, Building2, AlertCircle, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/nav/TopBar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/utils";

type Track = "creator" | "brand" | null;
type Status = "none" | "pending" | "approved" | "rejected";

const MOCK_STATUS: Status = "none"; // Replace with real DB check

export default function VerifyPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const followerCount = user?.followerCount ?? 0;
  const meetsFollowerThreshold = followerCount >= 100_000;

  const [track, setTrack] = useState<Track>(null);
  const [category, setCategory] = useState("");
  const [links, setLinks] = useState("");
  const [reason, setReason] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const status: Status = MOCK_STATUS;

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocFile(file);
  };

  const handleSubmit = async () => {
    if (!track) return;
    if (track === "brand" && !docFile) {
      toast("warning", "Please upload a legal document");
      return;
    }
    if (!category.trim() || !reason.trim()) {
      toast("warning", "Please fill out all fields");
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted || status === "pending") {
    return (
      <div className="flex flex-col min-h-screen pb-20 md:pb-0">
        <TopBar title="Verification" />
        <div className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-5 py-20">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BadgeCheck size={40} className="text-primary-light" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Application received</h2>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Our team reviews every request manually. Most decisions are made within 7–14 days. We'll notify you either way.
            </p>
          </div>
          <div className="card p-4 w-full max-w-sm text-left space-y-2">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
              Under review
            </div>
            <p className="text-xs text-text-secondary">Submitted by @{user?.username}</p>
          </div>
          <Link href="/settings" className="text-sm text-text-muted hover:text-text-secondary transition-colors mt-2">
            Back to Settings
          </Link>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="flex flex-col min-h-screen pb-20 md:pb-0">
        <TopBar title="Verification" />
        <div className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-5 py-20">
          <div className="w-20 h-20 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center">
            <BadgeCheck size={40} className="text-accent-green" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-2">You're verified</h2>
            <p className="text-text-muted text-sm">Your checkmark is active and visible on your profile and posts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <TopBar title="Apply for Verification" />

      <div className="px-4 pt-5 max-w-lg mx-auto w-full space-y-5">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
            <BadgeCheck size={30} className="text-primary-light" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-1">The checkmark is earned, not bought</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Verification on Verse is free and permanently off-limits to purchase. It signals authenticity — real people, real brands, real reach.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent-green font-semibold bg-accent-green/10 border border-accent-green/20 px-3 py-1.5 rounded-full">
            <Check size={12} /> Never sold. Never will be.
          </div>
        </motion.div>

        {/* Track selection */}
        {!track && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 px-1">Which applies to you?</p>
            <div className="space-y-3">

              {/* Creator track */}
              <button onClick={() => setTrack("creator")}
                className={cn(
                  "w-full card p-4 text-left flex items-start gap-3 transition-all hover:border-primary/30",
                  !meetsFollowerThreshold && "opacity-50 cursor-not-allowed"
                )}
                disabled={!meetsFollowerThreshold}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users size={18} className="text-primary-light" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-text-primary">Creator</span>
                    {meetsFollowerThreshold
                      ? <span className="text-[10px] font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full">You qualify</span>
                      : <span className="text-[10px] text-text-muted bg-white/[0.05] px-2 py-0.5 rounded-full">{formatCount(followerCount)} / 100K</span>
                    }
                  </div>
                  <p className="text-xs text-text-muted">Requires at least 100,000 followers on Verse.</p>
                </div>
                <ChevronRight size={15} className="text-text-muted flex-shrink-0 mt-3" />
              </button>

              {/* Brand / company track */}
              <button onClick={() => setTrack("brand")}
                className="w-full card p-4 text-left flex items-start gap-3 transition-all hover:border-primary/30">
                <div className="w-10 h-10 rounded-xl bg-accent-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 size={18} className="text-accent-amber" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-text-primary">Brand / Company</span>
                    <span className="text-[10px] font-bold text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded-full">No follower min</span>
                  </div>
                  <p className="text-xs text-text-muted">Provide legal registration documents. Follower count doesn't matter.</p>
                </div>
                <ChevronRight size={15} className="text-text-muted flex-shrink-0 mt-3" />
              </button>

            </div>

            {!meetsFollowerThreshold && (
              <div className="flex items-start gap-2 mt-4 px-3 py-3 rounded-xl bg-white/[0.03] border border-border">
                <AlertCircle size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted">
                  You currently have <strong className="text-text-secondary">{formatCount(followerCount)} followers</strong>.
                  The creator track requires 100K. Keep growing — or apply as a brand if that applies to you.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Application form */}
        <AnimatePresence>
          {track && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
              className="space-y-4">

              <div className="flex items-center gap-2">
                <button onClick={() => setTrack(null)} className="w-8 h-8 rounded-xl hover:bg-white/[0.05] flex items-center justify-center text-text-muted transition-colors">
                  <ArrowLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-text-primary">
                  {track === "creator" ? "Creator Verification" : "Brand / Company Verification"}
                </span>
              </div>

              <div className="card p-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">
                    {track === "creator" ? "Your category / niche" : "Company or brand name"}
                  </label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)}
                    placeholder={track === "creator" ? "e.g. Finance, Fitness, Comedy…" : "e.g. Acme Corp"}
                    className="input-base" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Links to verify your identity</label>
                  <textarea value={links} onChange={e => setLinks(e.target.value)} rows={3}
                    placeholder="Your website, Instagram, LinkedIn, YouTube, press mentions…"
                    className="input-base resize-none" />
                  <p className="text-xs text-text-muted mt-1">The more we can cross-reference, the faster the review.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Why should Verse verify you?</label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
                    placeholder="Tell us about your work, your audience, and why verification matters for you."
                    className="input-base resize-none" />
                </div>

                {track === "brand" && (
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">
                      Legal document <span className="text-accent-rose">*</span>
                    </label>
                    <label className={cn(
                      "flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer",
                      docFile ? "border-accent-green/40 bg-accent-green/5" : "border-border hover:border-primary/30 hover:bg-primary/5"
                    )}>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleDocChange} />
                      {docFile ? (
                        <>
                          <Check size={20} className="text-accent-green" />
                          <span className="text-xs text-accent-green font-semibold">{docFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} className="text-text-muted" />
                          <span className="text-xs text-text-muted text-center">
                            Company registration, incorporation certificate, or business licence<br />
                            <span className="text-text-secondary">PDF, JPG or PNG · Max 10MB</span>
                          </span>
                        </>
                      )}
                    </label>
                    <p className="text-xs text-text-muted mt-1.5">Documents are reviewed by our team and never shared publicly.</p>
                  </div>
                )}
              </div>

              <div className="card p-4 bg-white/[0.02] flex items-start gap-2.5">
                <AlertCircle size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted leading-relaxed">
                  False applications are permanently banned from reapplying. Verification may be removed at any time if criteria are no longer met or account behaviour changes.
                </p>
              </div>

              <Button variant="primary" size="lg" loading={submitting} onClick={handleSubmit} className="w-full gap-2">
                <BadgeCheck size={16} /> Submit application
              </Button>

              <p className="text-center text-xs text-text-muted pb-2">
                Review takes 7–14 days. We'll notify you via the app.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
