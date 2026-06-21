"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { Check, Zap, ArrowRight, Sparkles, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERESTS = [
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "finance", label: "Finance", emoji: "💰" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "art", label: "Art & Design", emoji: "🎨" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "content", label: "Content Creation", emoji: "📱" },
  { id: "business", label: "Business", emoji: "🏢" },
  { id: "film", label: "Film & TV", emoji: "🎬" },
  { id: "food", label: "Food", emoji: "🍕" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "education", label: "Education", emoji: "📚" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "science", label: "Science", emoji: "🧬" },
  { id: "entrepreneurship", label: "Startups", emoji: "🚀" },
  { id: "podcasting", label: "Podcasting", emoji: "🎙️" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "writing", label: "Writing", emoji: "✍️" },
];

type Creator = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
};

const MOCK_SUGGESTED: Creator[] = [
  { id: "s1", username: "versehq", displayName: "Verse", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=versehq", bio: "The official Verse account. Creator economy news, tips, and updates.", verified: true, followers: 1 },
  { id: "s2", username: "techminds", displayName: "Tech Minds", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techminds", bio: "Breaking down the future of technology one post at a time.", verified: false, followers: 0 },
  { id: "s3", username: "creatorpro", displayName: "Creator Pro", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creatorpro", bio: "Helping creators build sustainable businesses online.", verified: false, followers: 0 },
];

const STEPS = ["welcome", "interests", "creators", "done"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, authenticated, ready } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set(["s1", "s2", "s3"]));
  const [creators, setCreators] = useState<Creator[]>(MOCK_SUGGESTED);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) { router.replace("/login"); return; }
    const done = localStorage.getItem("verse_onboarding_done");
    if (done) { router.replace("/"); return; }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) return;
        const data = await res.json();
        if (data.users?.length > 0) {
          setCreators(data.users.slice(0, 5).map((u: Record<string, unknown>) => ({
            id: String(u.id),
            username: String(u.username ?? ""),
            displayName: String(u.displayName ?? u.display_name ?? "Creator"),
            avatar: String(u.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`),
            bio: String(u.bio ?? ""),
            verified: Boolean(u.verified),
            followers: Number(u.followerCount ?? 0),
          })));
        }
      } catch {}
    };
    fetchCreators();
  }, []);

  const goNext = () => {
    setDirection(1);
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleFollow = (id: string) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const finish = async () => {
    localStorage.setItem("verse_onboarding_done", "1");
    if (user) {
      try {
        await fetch("/api/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: user.id, followingIds: [...followedIds] }),
        });
      } catch {}
    }
    router.replace("/");
  };

  const stepIndex = STEPS.indexOf(step);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>

      {/* Progress dots */}
      {step !== "welcome" && step !== "done" && (
        <div className="absolute top-8 flex items-center gap-2">
          {["interests", "creators"].map((s, i) => (
            <div key={s} className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              s === step ? "w-6 bg-primary-light" : i < ["interests", "creators"].indexOf(step) ? "w-3 bg-primary-light/50" : "w-3 bg-white/10"
            )} />
          ))}
        </div>
      )}

      <div className="w-full max-w-sm relative">
        <AnimatePresence mode="wait" custom={direction}>
          {step === "welcome" && (
            <motion.div key="welcome" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center gap-6">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Zap size={36} className="text-white fill-white" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }} className="space-y-3">
                <h1 className="text-4xl font-bold font-display gradient-text leading-tight">
                  Welcome to Verse
                </h1>
                <p className="text-text-secondary text-lg leading-relaxed">
                  The internet where creators own their content, audience, and earnings.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }} className="flex flex-col gap-3 w-full">
                {[
                  "Keep 95% of everything you earn",
                  "Your audience is yours — forever",
                  "Post once, reach everywhere",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-border text-left">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-primary-light" />
                    </div>
                    <span className="text-sm text-text-secondary">{point}</span>
                  </div>
                ))}
              </motion.div>

              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                onClick={goNext}
                className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold text-base flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-transform">
                Let&apos;s go <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {step === "interests" && (
            <motion.div key="interests" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-1">What do you care about?</h2>
                <p className="text-text-muted text-sm">Pick at least 3 topics to personalise your feed.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const selected = selectedInterests.has(interest.id);
                  return (
                    <motion.button key={interest.id} whileTap={{ scale: 0.93 }}
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all",
                        selected
                          ? "bg-primary/15 border-primary/40 text-primary-light"
                          : "bg-white/[0.03] border-border text-text-secondary hover:border-border-strong"
                      )}>
                      <span>{interest.emoji}</span>
                      <span>{interest.label}</span>
                      {selected && <Check size={12} className="text-primary-light" />}
                    </motion.button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <button onClick={goNext} disabled={selectedInterests.size < 3}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-base transition-all",
                    selectedInterests.size >= 3
                      ? "bg-gradient-primary text-white shadow-glow active:scale-[0.98]"
                      : "bg-white/[0.04] text-text-muted cursor-not-allowed"
                  )}>
                  {selectedInterests.size < 3 ? `Pick ${3 - selectedInterests.size} more` : "Continue"}
                </button>
              </div>
            </motion.div>
          )}

          {step === "creators" && (
            <motion.div key="creators" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-primary-light" />
                  <h2 className="text-2xl font-bold text-text-primary">People worth following</h2>
                </div>
                <p className="text-text-muted text-sm">Follow a few creators to make your feed come alive.</p>
              </div>

              <div className="space-y-3">
                {creators.map((creator) => {
                  const following = followedIds.has(creator.id);
                  return (
                    <motion.div key={creator.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-border">
                      <Avatar src={creator.avatar} alt={creator.displayName} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-text-primary truncate">{creator.displayName}</span>
                          {creator.verified && <BadgeCheck size={13} className="text-primary-light flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-text-muted line-clamp-1">@{creator.username}</p>
                      </div>
                      <button onClick={() => toggleFollow(creator.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex-shrink-0",
                          following
                            ? "bg-primary/15 text-primary-light border-primary/30"
                            : "bg-white/[0.06] text-text-secondary border-border"
                        )}>
                        {following ? "Following" : "Follow"}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <button onClick={goNext}
                  className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold text-base shadow-glow active:scale-[0.98] transition-transform">
                  Continue
                </button>
                <button onClick={goNext} className="w-full py-2 text-sm text-text-muted hover:text-text-secondary transition-colors">
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center gap-8">
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Check size={44} className="text-white" strokeWidth={3} />
                </div>
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], x: Math.cos((i / 8) * Math.PI * 2) * 55, y: Math.sin((i / 8) * Math.PI * 2) * 55 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary-light -translate-x-1/2 -translate-y-1/2" />
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }} className="space-y-2">
                <h2 className="text-3xl font-bold gradient-text">You&apos;re in.</h2>
                <p className="text-text-secondary text-lg">Your feed is ready. Start exploring or create your first post.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }} className="w-full space-y-3">
                <button onClick={finish}
                  className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold text-base shadow-glow active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                  Go to my feed <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
