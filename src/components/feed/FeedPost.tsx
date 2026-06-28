"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Repeat2, Zap, MoreHorizontal, Lock, BadgeCheck, TrendingUp, Users2, Share2, Copy, Check, ExternalLink, Flag, EyeOff, UserX, Link as LinkIcon, Bookmark, FileText, Upload, X, Shield } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Popover } from "@/components/ui/Popover";
import { HumanityBadge } from "@/components/features/HumanityBadge";
import { ReputationStake } from "@/components/features/ReputationStake";
import { ExpertBadge } from "@/components/features/ExpertBadge";
import { useToast } from "@/components/ui/Toast";
import { CommentSection } from "@/components/feed/CommentSection";
import { type Post } from "@/lib/mock-data";
import { formatCount, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";

export function FeedPost({ post }: { post: Post }) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(post.isReposted);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const [showTip, setShowTip] = useState(false);
  const [tipping, setTipping] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLicenseFlow, setShowLicenseFlow] = useState(false);
  const [licenseStep, setLicenseStep] = useState<1 | 2 | 3>(1);
  const [attestation, setAttestation] = useState(false);
  const [peopleOption, setPeopleOption] = useState<"no" | "yes-release" | "yes-news" | null>(null);
  const [releaseUploaded, setReleaseUploaded] = useState(false);
  const [listingAsLicensable, setListingAsLicensable] = useState(false);
  const [isLicensable, setIsLicensable] = useState(false);
  const [commercialCleared, setCommercialCleared] = useState(false);
  const { toast } = useToast();

  const postDetailUrl = `/posts/${post.id}`;
  const openPost = () => router.push(postDetailUrl);

  // Close comments when clicking outside the comment section
  useEffect(() => {
    if (!showComments) return;
    let removeListener: (() => void) | undefined;
    const t = setTimeout(() => {
      const handler = (e: MouseEvent) => {
        if (commentsRef.current && !commentsRef.current.contains(e.target as Node)) {
          setShowComments(false);
        }
      };
      document.addEventListener("click", handler);
      removeListener = () => document.removeEventListener("click", handler);
    }, 0);
    return () => { clearTimeout(t); removeListener?.(); };
  }, [showComments]);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(n => wasLiked ? n - 1 : n + 1);
    if (!user) return;
    try {
      await fetch("/api/likes", {
        method: wasLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, postId: post.id }),
      });
    } catch {
      // revert on error
      setLiked(wasLiked);
      setLikeCount(n => wasLiked ? n + 1 : n - 1);
    }
  };

  const handleRepost = () => {
    setReposted(v => !v);
    setRepostCount(n => reposted ? n - 1 : n + 1);
  };

  const handleTip = async (amount: number) => {
    setTipping(true);
    await new Promise(r => setTimeout(r, 1200));
    setTipping(false);
    setShowTip(false);
    toast("tip", `Tipped ${post.creator.displayName}`, `$${amount}`);
  };

  const postUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${post.creator.username}`;
  const shareText = `"${post.content.slice(0, 120)}${post.content.length > 120 ? "…" : ""}"\n\n— @${post.creator.username} on Verse\n\nThe platform where creators actually own their audience 👇`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`, "_blank");
    setShowShare(false);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + postUrl)}`, "_blank");
    setShowShare(false);
  };

  const handleCastFarcaster = () => {
    const castText = `"${post.content.slice(0, 200)}"\n\n— @${post.creator.username} on Verse`;
    window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${encodeURIComponent(postUrl)}`, "_blank");
    setShowShare(false);
  };

  const handleSave = () => {
    setSaved(v => !v);
    toast(saved ? "info" : "success", saved ? "Removed from saved" : "Post saved");
  };

  if (hidden) return null;

  return (
    <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4 group">

      {/* Collab banner */}
      {post.collaborators && post.collaborators.length > 0 && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-accent-cyan/6 border border-accent-cyan/15">
          <Users2 size={12} className="text-accent-cyan" />
          <span className="text-[11px] text-text-secondary">
            Collab with{" "}
            {post.collaborators.map((c, i) => (
              <span key={c.creator.username}>
                <Link href={`/${c.creator.username}`} className="text-accent-cyan font-semibold hover:underline">@{c.creator.username}</Link>
                <span className="text-text-muted"> ({c.splitPercent}%)</span>
                {i < post.collaborators!.length - 1 && ", "}
              </span>
            ))}
            {" · "}
            <span className="text-text-muted">Revenue split automatically</span>
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link href={`/${post.creator.username}`} className="flex items-center gap-2.5">
          <Avatar src={post.creator.avatar} alt={post.creator.displayName} size="md" ring={post.creator.verified} />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-text-primary hover:text-primary-light transition-colors">{post.creator.displayName}</span>
              {post.creator.verified && <BadgeCheck size={14} className="text-primary-light" />}
              {post.anonymousExpert && (
                <span className="text-[10px] bg-accent-green/10 text-accent-green border border-accent-green/20 px-1.5 py-0.5 rounded-full font-bold">
                  {post.anonymousExpert.credential}
                </span>
              )}
            </div>
            <div className="text-xs text-text-muted">
              @{post.creator.username} · <Link href={`/posts/${post.id}`} className="hover:text-text-secondary transition-colors">{timeAgo(post.createdAt)}</Link>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          {post.isExclusive && <Badge variant="amber" className="gap-1"><Lock size={9} /> Members</Badge>}
          <HumanityBadge score={post.humanityScore} isVerified={post.isHumanVerified} />
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}
              className="w-7 h-7 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-text-muted transition-all">
              <MoreHorizontal size={15} />
            </button>
            <Popover open={showMenu} onClose={() => setShowMenu(false)}
              anchor="top-right" className="w-52 glass border border-border rounded-2xl py-1.5 shadow-card-hover overflow-hidden">
              <button onClick={() => { handleCopyLink(); setShowMenu(false); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-colors">
                <LinkIcon size={13} className="text-text-muted" /> Copy link
              </button>
              <button onClick={() => { openPost(); setShowMenu(false); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-colors">
                <ExternalLink size={13} className="text-text-muted" /> Open post
              </button>
              {!isLicensable && (
                <button onClick={() => { setShowMenu(false); setLicenseStep(1); setAttestation(false); setPeopleOption(null); setReleaseUploaded(false); setShowLicenseFlow(true); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-colors">
                  <FileText size={13} className="text-text-muted" /> List for licensing
                </button>
              )}
              {isLicensable && (
                <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-accent-green cursor-default">
                  <Check size={13} /> Listed for licensing
                </button>
              )}
              <div className="h-px bg-border mx-3 my-1" />
              <button onClick={() => { setHidden(true); setShowMenu(false); toast("success", "Post hidden"); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-colors">
                <EyeOff size={13} className="text-text-muted" /> Not interested
              </button>
              <button onClick={() => { setShowMenu(false); toast("success", "Reported", "Our team will review this"); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-accent-rose hover:bg-accent-rose/8 transition-colors">
                <Flag size={13} /> Report post
              </button>
              <button onClick={() => { setShowMenu(false); toast("success", `Blocked @${post.creator.username}`); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-accent-rose hover:bg-accent-rose/8 transition-colors">
                <UserX size={13} /> Block @{post.creator.username}
              </button>
            </Popover>
          </div>
        </div>
      </div>

      {/* Anonymous expert verification */}
      {post.anonymousExpert && (
        <div className="mb-3">
          <ExpertBadge credential={post.anonymousExpert.credential} zkProof={post.anonymousExpert.zkProof} />
        </div>
      )}

      {/* Content — clicking anywhere on body opens post detail */}
      <div onClick={openPost} className="cursor-pointer">
        {post.isExclusive ? (
          <div className="relative mb-3">
            <p className="text-text-secondary text-sm leading-relaxed blur-sm select-none">{post.content}</p>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-base/60 backdrop-blur-sm rounded-xl gap-3 border border-accent-amber/20"
              onClick={e => e.stopPropagation()}>
              <Lock size={20} className="text-accent-amber" />
              <p className="text-sm font-semibold text-text-primary text-center px-4">
                This is <span className="text-accent-amber font-bold">members-only</span> content
              </p>
              <Button variant="gradient" size="sm" className="gap-1.5"><TrendingUp size={13} /> Become a member</Button>
            </div>
          </div>
        ) : (
          <p className="text-text-primary text-[15px] leading-relaxed mb-3">{post.content}</p>
        )}

        {/* Media */}
        {post.media && !post.isExclusive && (
          <div className="rounded-2xl overflow-hidden mb-3 bg-bg-elevated">
            <img src={post.media} alt="Post media" className="w-full object-cover max-h-[500px]" loading="lazy" />
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3" onClick={e => e.stopPropagation()}>
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-accent-cyan hover:text-accent-cyan/80 cursor-pointer transition-colors">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Reputation stake */}
      {post.hasStake && post.stakeTopic && post.stakeDeadline && (
        <ReputationStake
          topic={post.stakeTopic}
          stakeAmount={post.stakeAmount ?? 0}
          yesVotes={post.stakeYes ?? 0}
          noVotes={post.stakeNo ?? 0}
          deadline={post.stakeDeadline}
          creatorName={post.creator.displayName}
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
        <div className="flex items-center gap-1">
          <motion.button whileTap={{ scale: 0.85 }} onClick={handleLike}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              liked ? "text-accent-rose bg-accent-rose/10" : "text-text-muted hover:text-accent-rose hover:bg-accent-rose/8")}>
            <Heart size={15} className={cn(liked && "fill-accent-rose")} />
            <span>{formatCount(likeCount)}</span>
          </motion.button>

          <button onClick={() => setShowComments(v => !v)}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              showComments ? "text-accent-cyan bg-accent-cyan/10" : "text-text-muted hover:text-accent-cyan hover:bg-accent-cyan/8")}>
            <MessageCircle size={15} />
            <span>{formatCount(post.comments)}</span>
          </button>

          <motion.button whileTap={{ scale: 0.85 }} onClick={handleRepost}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              reposted ? "text-accent-green bg-accent-green/10" : "text-text-muted hover:text-accent-green hover:bg-accent-green/8")}>
            <Repeat2 size={15} />
            <span>{formatCount(repostCount)}</span>
          </motion.button>

          {/* Share / Content arbitrage */}
          <div className="relative">
            <button onClick={() => setShowShare(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-primary-light hover:bg-primary/8 transition-all">
              <Share2 size={15} />
            </button>
            <Popover open={showShare} onClose={() => setShowShare(false)}
              anchor="bottom-left" className="glass border border-border rounded-2xl p-3 shadow-card-hover min-w-[180px] space-y-1">
              <button onClick={handleCastFarcaster} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-xs text-text-secondary hover:text-text-primary transition-colors">
                <span className="w-3 h-3 rounded-sm bg-violet-500 flex-shrink-0" /> Cast on Farcaster
              </button>
              <button onClick={handleShareTwitter} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-xs text-text-secondary hover:text-text-primary transition-colors">
                <ExternalLink size={13} className="text-sky-400" /> Post on X / Twitter
              </button>
              <button onClick={handleShareWhatsApp} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-xs text-text-secondary hover:text-text-primary transition-colors">
                <MessageCircle size={13} className="text-accent-green" /> Share on WhatsApp
              </button>
              <button onClick={handleCopyLink} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-xs text-text-secondary hover:text-text-primary transition-colors">
                {shareCopied ? <Check size={13} className="text-accent-green" /> : <Copy size={13} />}
                {shareCopied ? "Copied!" : "Copy link"}
              </button>
            </Popover>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Save */}
          <motion.button whileTap={{ scale: 0.85 }} onClick={handleSave}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              saved ? "text-primary-light bg-primary/10" : "text-text-muted hover:text-primary-light hover:bg-primary/8")}>
            <Bookmark size={15} className={cn(saved && "fill-primary-light")} />
          </motion.button>

          {/* Tip */}
        <div className="relative">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowTip(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-accent-amber hover:bg-accent-amber/10 transition-all border border-accent-amber/0 hover:border-accent-amber/20">
            <Zap size={14} className="fill-accent-amber" />
            <span>Tip</span>
          </motion.button>
          <Popover open={showTip} onClose={() => setShowTip(false)}
            anchor="bottom-right" className="glass border border-border rounded-2xl p-3 shadow-card-hover min-w-[180px]">
            <p className="text-xs text-text-muted mb-2 font-medium">Send a tip</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 5, 10, 25, 50, 100].map(amt => (
                <button key={amt} onClick={() => handleTip(amt)} disabled={tipping}
                  className="px-2 py-1.5 rounded-lg bg-accent-amber/10 hover:bg-accent-amber/20 text-accent-amber text-xs font-bold transition-colors border border-accent-amber/15 disabled:opacity-50">
                  ${amt}
                </button>
              ))}
            </div>
          </Popover>
        </div>
        </div>
      </div>
      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <div ref={commentsRef} onClick={e => e.stopPropagation()}>
            <CommentSection postId={post.id} />
          </div>
        )}
      </AnimatePresence>

      {/* License flow modal */}
      <AnimatePresence>
        {showLicenseFlow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setShowLicenseFlow(false)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              className="w-full md:max-w-lg bg-bg-elevated border border-border rounded-t-3xl md:rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>

              {/* Progress */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-muted">Step {licenseStep} of 3</span>
                <button onClick={() => setShowLicenseFlow(false)} className="text-text-muted hover:text-text-secondary"><X size={17} /></button>
              </div>
              <div className="flex gap-1 mb-5">
                {[1, 2, 3].map(s => (
                  <div key={s} className={cn("h-0.5 flex-1 rounded-full transition-colors", s <= licenseStep ? "bg-primary" : "bg-white/[0.08]")} />
                ))}
              </div>

              {/* Step 1 — Ownership attestation */}
              {licenseStep === 1 && (
                <>
                  <h3 className="text-base font-bold text-text-primary mb-1">Confirm ownership</h3>
                  <p className="text-xs text-text-muted mb-4 leading-relaxed">
                    By listing this content for licensing, you make a legal representation that you own or control all rights to it.
                  </p>
                  <button onClick={() => setAttestation(v => !v)}
                    className={cn("w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all mb-5",
                      attestation ? "border-accent-green/40 bg-accent-green/5" : "border-border hover:border-border-strong")}>
                    <div className={cn("w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                      attestation ? "bg-accent-green border-accent-green" : "border-border-strong")}>
                      {attestation && <Check size={10} className="text-white" />}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      I created this content and own or control all rights to license it. I understand that false claims make me liable to Verse, licensees, and any affected third parties.
                    </p>
                  </button>
                  <Button variant="primary" size="sm" className="w-full" disabled={!attestation}
                    onClick={() => setLicenseStep(2)}>
                    Continue
                  </Button>
                </>
              )}

              {/* Step 2 — People / model releases */}
              {licenseStep === 2 && (
                <>
                  <h3 className="text-base font-bold text-text-primary mb-1">Identifiable people</h3>
                  <p className="text-xs text-text-muted mb-4 leading-relaxed">
                    Commercial licenses (ads, brands, marketing) require a signed model release for every identifiable person in the content.
                  </p>
                  <div className="space-y-2 mb-4">
                    {[
                      { val: "no" as const, label: "No identifiable people", sub: "All license tiers available, including commercial", icon: <Check size={14} className="text-accent-green" /> },
                      { val: "yes-release" as const, label: "Yes — I have signed model releases", sub: "Upload PDF releases to unlock commercial licensing", icon: <Upload size={14} className="text-accent-cyan" /> },
                      { val: "yes-news" as const, label: "Yes — newsworthy public event", sub: "Editorial licenses only. No commercial use.", icon: <Shield size={14} className="text-accent-amber" /> },
                    ].map(opt => (
                      <button key={opt.val} onClick={() => setPeopleOption(opt.val)}
                        className={cn("w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                          peopleOption === opt.val ? "border-primary/40 bg-primary/8" : "border-border hover:border-border-strong")}>
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          peopleOption === opt.val ? "bg-primary/20" : "bg-white/[0.04]")}>
                          {opt.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{opt.label}</p>
                          <p className="text-[11px] text-text-muted mt-0.5">{opt.sub}</p>
                        </div>
                        {peopleOption === opt.val && <Check size={13} className="text-primary-light ml-auto flex-shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Model release upload */}
                  {peopleOption === "yes-release" && (
                    <div className={cn("rounded-xl border p-3 mb-4 transition-all",
                      releaseUploaded ? "border-accent-green/30 bg-accent-green/5" : "border-dashed border-border")}>
                      {releaseUploaded ? (
                        <div className="flex items-center gap-2 text-xs text-accent-green font-semibold">
                          <Check size={13} /> Model release uploaded
                        </div>
                      ) : (
                        <label className="flex flex-col items-center gap-1.5 cursor-pointer py-2">
                          <Upload size={18} className="text-text-muted" />
                          <span className="text-xs text-text-muted">Upload signed release (PDF)</span>
                          <input type="file" accept=".pdf,.jpg,.png" className="hidden"
                            onChange={() => setReleaseUploaded(true)} />
                        </label>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setLicenseStep(1)}>Back</Button>
                    <Button variant="primary" size="sm" className="flex-1"
                      disabled={!peopleOption || (peopleOption === "yes-release" && !releaseUploaded)}
                      onClick={() => setLicenseStep(3)}>
                      Continue
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3 — Confirm & list */}
              {licenseStep === 3 && (
                <>
                  <h3 className="text-base font-bold text-text-primary mb-1">Ready to list</h3>
                  <div className="rounded-xl border border-border bg-white/[0.02] p-4 mb-4 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Ownership</span>
                      <span className="text-accent-green font-semibold flex items-center gap-1"><Check size={10} /> Attested</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Commercial use</span>
                      {(peopleOption === "no" || peopleOption === "yes-release") ? (
                        <span className="text-accent-green font-semibold flex items-center gap-1"><Check size={10} /> Cleared</span>
                      ) : (
                        <span className="text-accent-amber font-semibold">Editorial only</span>
                      )}
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Available tiers</span>
                      <span className="text-text-primary font-semibold">
                        {(peopleOption === "no" || peopleOption === "yes-release")
                          ? "Blog · News · Commercial · Broadcast"
                          : "Blog · News"}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted mb-4 leading-relaxed">
                    This post will appear in the Content Licensing marketplace. Journalists and outlets can browse and license it directly.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setLicenseStep(2)}>Back</Button>
                    <Button variant="primary" size="sm" className="flex-1" loading={listingAsLicensable}
                      onClick={async () => {
                        setListingAsLicensable(true);
                        await new Promise(r => setTimeout(r, 1000));
                        setListingAsLicensable(false);
                        setIsLicensable(true);
                        setCommercialCleared(peopleOption === "no" || peopleOption === "yes-release");
                        setShowLicenseFlow(false);
                        toast("success", "Listed for licensing", "Visible in the Content Licensing marketplace");
                      }}>
                      List for licensing
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
