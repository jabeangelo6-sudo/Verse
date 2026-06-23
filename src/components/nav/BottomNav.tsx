"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, Bell, TrendingUp, Plus, Camera, Video, PenLine, Grid, Crown, FileText, Brain, Shield, BarChart3, Link2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { mediaStore } from "@/lib/media-store";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  null,
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: null, icon: Grid, label: "More" },
];

const MORE_ITEMS = [
  { href: "/earnings", icon: TrendingUp, label: "Earnings", color: "text-accent-green", bg: "bg-accent-green/15 border-accent-green/20" },
  { href: "/inner-circle", icon: Crown, label: "Inner Circle", color: "text-accent-amber", bg: "bg-accent-amber/15 border-accent-amber/20" },
  { href: "/licensing", icon: FileText, label: "Licensing", color: "text-primary-light", bg: "bg-primary/15 border-primary/20" },
  { href: "/brain-trust", icon: Brain, label: "Brain Trust", color: "text-accent-cyan", bg: "bg-accent-cyan/15 border-accent-cyan/20" },
  { href: "/whistle", icon: Shield, label: "Verified Leaks", color: "text-accent-rose", bg: "bg-accent-rose/15 border-accent-rose/20" },
  { href: "/derivatives", icon: BarChart3, label: "Content Futures", color: "text-accent-amber", bg: "bg-accent-amber/15 border-accent-amber/20" },
  { href: "/integrations", icon: Link2, label: "Integrations", color: "text-text-secondary", bg: "bg-white/[0.06] border-white/[0.08]" },
  { href: "/agency", icon: Building2, label: "Agency", color: "text-accent-cyan", bg: "bg-accent-cyan/15 border-accent-cyan/20" },
  { href: "/data", icon: Shield, label: "My Data", color: "text-accent-green", bg: "bg-accent-green/15 border-accent-green/20" },
];

const EASE = "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)";

function useSwipeDismiss(onDismiss: () => void) {
  const startY = useRef(0);
  const dragging = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !sheetRef.current) return;
    const dy = e.clientY - startY.current;
    if (dy > 0) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !sheetRef.current) return;
    dragging.current = false;
    const dy = e.clientY - startY.current;
    sheetRef.current.style.transition = EASE;
    if (dy > 80) {
      sheetRef.current.style.transform = "translateY(100%)";
      setTimeout(() => {
        onDismiss();
        if (sheetRef.current) sheetRef.current.style.transform = "";
      }, 300);
    } else {
      sheetRef.current.style.transform = "translateY(0)";
      setTimeout(() => { if (sheetRef.current) sheetRef.current.style.transform = ""; }, 300);
    }
  };

  const handleProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    style: { touchAction: "none" } as React.CSSProperties,
  };

  return { sheetRef, handleProps };
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSheet, setShowSheet] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const sheetSwipe = useSwipeDismiss(() => setShowSheet(false));
  const moreSwipe  = useSwipeDismiss(() => setShowMore(false));

  // Lock body scroll while any sheet is open so the feed doesn't move behind it
  useEffect(() => {
    document.body.style.overflow = (showSheet || showMore) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showSheet, showMore]);

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    mediaStore.set({ url, type, name: file.name, file });
    setShowSheet(false);
    router.push("/create");
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav safe-pb md:hidden">
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {NAV_ITEMS.map((item) => {
            if (!item) {
              return (
                <button key="fab" onClick={() => { setShowSheet(true); setShowMore(false); }}
                  className="relative -top-5 w-14 h-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
                  <motion.div animate={{ rotate: showSheet ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Plus size={28} className="text-white" strokeWidth={2.5} />
                  </motion.div>
                </button>
              );
            }
            if (item.href === null) {
              return (
                <button key="more" onClick={() => { setShowMore(true); setShowSheet(false); }}
                  className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors">
                  <span className={cn("transition-colors duration-200", showMore ? "text-primary-light" : "text-text-muted")}>
                    <item.icon size={22} strokeWidth={showMore ? 2.5 : 1.8} />
                  </span>
                  <span className={cn("text-[10px] font-medium transition-colors duration-200", showMore ? "text-primary-light" : "text-text-muted")}>
                    {item.label}
                  </span>
                </button>
              );
            }
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors">
                <span className={cn("transition-colors duration-200", active ? "text-primary-light" : "text-text-muted")}>
                  <item.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                </span>
                <span className={cn("text-[10px] font-medium transition-colors duration-200", active ? "text-primary-light" : "text-text-muted")}>
                  {item.label}
                </span>
                {active && (
                  <motion.div layoutId="nav-dot"
                    className="absolute top-1 right-3 w-1 h-1 rounded-full bg-primary-light"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Shared backdrop */}
      <AnimatePresence>
        {(showMore || showSheet) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            onClick={() => { setShowMore(false); setShowSheet(false); }} />
        )}
      </AnimatePresence>

      {/* More sheet */}
      <div
        ref={moreSwipe.sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border rounded-t-3xl px-5 pb-10"
        style={{
          transform: showMore ? "translateY(0)" : "translateY(100%)",
          transition: EASE,
          pointerEvents: showMore ? "auto" : "none",
          touchAction: "none",
        }}
        {...moreSwipe.handleProps}>
        {/* Visual handle only */}
        <div className="flex justify-center pt-4 pb-4">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest text-center mb-5">Earn &amp; Build</p>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {MORE_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setShowMore(false)}
                className="flex flex-col items-center gap-2">
                <div className={cn("w-14 h-14 rounded-2xl border flex items-center justify-center transition-all", item.bg, active && "ring-2 ring-primary/40")}>
                  <item.icon size={22} className={item.color} />
                </div>
                <span className="text-[10px] font-medium text-text-muted text-center leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <button onClick={() => setShowMore(false)}
          className="w-full py-3.5 rounded-2xl bg-white/[0.04] text-text-muted text-sm font-semibold mb-2">
          Close
        </button>
      </div>

      {/* Hidden file inputs */}
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleMedia(e, "image")} />
      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleMedia(e, "video")} />

      {/* Create sheet */}
      <div
        ref={sheetSwipe.sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border rounded-t-3xl px-6 pb-10"
        style={{
          transform: showSheet ? "translateY(0)" : "translateY(100%)",
          transition: EASE,
          pointerEvents: showSheet ? "auto" : "none",
          touchAction: "none",
        }}
        {...sheetSwipe.handleProps}>
        {/* Visual handle only */}
        <div className="flex justify-center pt-4 pb-4">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest text-center mb-6">Create</p>
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[
            { icon: <PenLine size={26} className="text-primary-light" />, label: "Write", bg: "bg-primary/15 border border-primary/20", action: () => { setShowSheet(false); router.push("/create"); } },
            { icon: <Camera size={26} className="text-accent-amber" />, label: "Photo", bg: "bg-accent-amber/15 border border-accent-amber/20", action: () => photoRef.current?.click() },
            { icon: <Video size={26} className="text-accent-cyan" />, label: "Video", bg: "bg-accent-cyan/15 border border-accent-cyan/20", action: () => videoRef.current?.click() },
          ].map((opt) => (
            <motion.button key={opt.label} whileTap={{ scale: 0.92 }} onClick={opt.action} className="flex flex-col items-center gap-3">
              <div className={cn("w-[72px] h-[72px] rounded-2xl flex items-center justify-center", opt.bg)}>{opt.icon}</div>
              <span className="text-sm font-semibold text-text-secondary">{opt.label}</span>
            </motion.button>
          ))}
        </div>
        <button onClick={() => setShowSheet(false)}
          className="w-full py-3.5 rounded-2xl bg-white/[0.04] text-text-muted text-sm font-semibold hover:bg-white/[0.07] transition-colors mb-2">
          Cancel
        </button>
      </div>
    </>
  );
}
