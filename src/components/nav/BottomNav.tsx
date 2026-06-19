"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, Bell, TrendingUp, Plus, Camera, Video, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { mediaStore } from "@/lib/media-store";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  null,
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/wallet", icon: TrendingUp, label: "Earnings" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSheet, setShowSheet] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

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
          {NAV_ITEMS.map((item, i) => {
            if (!item) {
              return (
                <button key="fab" onClick={() => setShowSheet(true)}
                  className="relative -top-5 w-14 h-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
                  <motion.div animate={{ rotate: showSheet ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Plus size={28} className="text-white" strokeWidth={2.5} />
                  </motion.div>
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

      {/* Hidden file inputs */}
      <input ref={photoRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleMedia(e, "image")} />
      <input ref={videoRef} type="file" accept="video/*" className="hidden"
        onChange={(e) => handleMedia(e, "video")} />

      {/* Create bottom sheet */}
      <AnimatePresence>
        {showSheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setShowSheet(false)} />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border rounded-t-3xl px-6 pt-4 pb-10 md:hidden">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-7" />
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest text-center mb-6">Create</p>
              <div className="grid grid-cols-3 gap-5 mb-6">
                {[
                  {
                    icon: <PenLine size={26} className="text-primary-light" />,
                    label: "Write",
                    bg: "bg-primary/15 border border-primary/20",
                    action: () => { setShowSheet(false); router.push("/create"); }
                  },
                  {
                    icon: <Camera size={26} className="text-accent-amber" />,
                    label: "Photo",
                    bg: "bg-accent-amber/15 border border-accent-amber/20",
                    action: () => photoRef.current?.click()
                  },
                  {
                    icon: <Video size={26} className="text-accent-cyan" />,
                    label: "Video",
                    bg: "bg-accent-cyan/15 border border-accent-cyan/20",
                    action: () => videoRef.current?.click()
                  },
                ].map((opt) => (
                  <motion.button key={opt.label} whileTap={{ scale: 0.92 }}
                    onClick={opt.action}
                    className="flex flex-col items-center gap-3">
                    <div className={cn("w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center", opt.bg)}>
                      {opt.icon}
                    </div>
                    <span className="text-sm font-semibold text-text-secondary">{opt.label}</span>
                  </motion.button>
                ))}
              </div>
              <button onClick={() => setShowSheet(false)}
                className="w-full py-3.5 rounded-2xl bg-white/[0.04] text-text-muted text-sm font-semibold hover:bg-white/[0.07] transition-colors">
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
