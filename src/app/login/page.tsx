"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, ArrowRight, Wallet, Shield, Users, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ToastProvider } from "@/components/ui/Toast";
import Link from "next/link";

type Step = "landing" | "email" | "verify" | "username" | "done";

const FEATURES = [
  { icon: <Users size={18} />, title: "Portable audience", desc: "Your followers live on-chain. Take them anywhere, forever." },
  { icon: <Wallet size={18} />, title: "Earn instantly", desc: "Tips, subscriptions, and token sales — you keep 97.5%." },
  { icon: <Globe size={18} />, title: "Censorship-proof", desc: "Content stored on IPFS + Arweave. No one can take it down." },
  { icon: <Shield size={18} />, title: "No KYC required", desc: "Pseudonymous by default. Your identity, your choice." },
];

function OnboardingInner() {
  const [step, setStep] = useState<Step>("landing");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("verify");
    toast("success", "Code sent to " + email);
  };

  const handleVerify = async () => {
    if (code.length < 4) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("username");
  };

  const handleUsername = async () => {
    if (!username.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent-cyan/8 blur-[100px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {step === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen relative">
            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-16 pb-8">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow-primary animate-pulse-glow">
                  <Zap size={28} className="text-white fill-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold font-display mb-3"
              >
                <span className="gradient-text">Own your audience.</span>
                <br />
                <span className="text-text-primary">Forever.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-text-secondary text-lg max-w-sm mb-10"
              >
                The decentralized creator platform where no one can ban you, steal your audience, or take your earnings.
              </motion.p>

              {/* Feature pills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 w-full max-w-sm mb-10"
              >
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="card p-3 text-left"
                  >
                    <div className="text-primary-light mb-1.5">{f.icon}</div>
                    <div className="text-xs font-semibold text-text-primary mb-0.5">{f.title}</div>
                    <div className="text-[11px] text-text-muted leading-relaxed">{f.desc}</div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full max-w-sm space-y-3"
              >
                <Button variant="gradient" size="lg" fullWidth onClick={() => setStep("email")} className="gap-2 text-base">
                  <Mail size={18} /> Get started with email
                </Button>
                <Button variant="secondary" size="lg" fullWidth className="gap-2">
                  <Wallet size={18} /> Connect wallet
                </Button>
                <p className="text-xs text-text-muted">
                  No KYC · No seed phrases for email signup · Own your data
                </p>
              </motion.div>
            </div>

            <div className="text-center pb-8 text-xs text-text-muted">
              Already have an account?{" "}
              <Link href="/" className="text-primary-light hover:text-primary font-medium">Sign in</Link>
            </div>
          </motion.div>
        )}

        {step === "email" && (
          <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col min-h-screen items-center justify-center px-6 relative">
            <div className="w-full max-w-sm">
              <button onClick={() => setStep("landing")} className="text-text-muted text-sm mb-8 hover:text-text-secondary flex items-center gap-1.5">
                <ArrowRight size={14} className="rotate-180" /> Back
              </button>
              <h2 className="text-2xl font-bold text-text-primary mb-2">What's your email?</h2>
              <p className="text-text-muted text-sm mb-6">We'll create a wallet for you automatically — no browser extension needed.</p>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                className="input-base mb-4 text-base"
                autoFocus
              />
              <Button variant="gradient" size="lg" fullWidth onClick={handleEmailSubmit} loading={loading} className="gap-2">
                Continue <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === "verify" && (
          <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col min-h-screen items-center justify-center px-6 relative">
            <div className="w-full max-w-sm">
              <button onClick={() => setStep("email")} className="text-text-muted text-sm mb-8 hover:text-text-secondary flex items-center gap-1.5">
                <ArrowRight size={14} className="rotate-180" /> Back
              </button>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Check your email</h2>
              <p className="text-text-muted text-sm mb-6">We sent a 6-digit code to <strong className="text-text-secondary">{email}</strong></p>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="input-base mb-4 text-center text-2xl tracking-[0.5em] font-mono"
                autoFocus
              />
              <Button variant="gradient" size="lg" fullWidth onClick={handleVerify} loading={loading} disabled={code.length < 6} className="gap-2">
                Verify <ArrowRight size={16} />
              </Button>
              <button className="w-full text-center text-xs text-text-muted mt-4 hover:text-text-secondary">Resend code</button>
            </div>
          </motion.div>
        )}

        {step === "username" && (
          <motion.div key="username" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col min-h-screen items-center justify-center px-6 relative">
            <div className="w-full max-w-sm">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Choose your username</h2>
              <p className="text-text-muted text-sm mb-6">This becomes your on-chain identity. Choose wisely — it's yours forever.</p>
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">@</span>
                <input
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="input-base pl-8"
                  autoFocus
                />
              </div>
              {username.length > 2 && (
                <p className="text-xs text-accent-green flex items-center gap-1.5 mb-4">
                  <CheckCircle size={12} /> @{username} is available
                </p>
              )}
              <Button variant="gradient" size="lg" fullWidth onClick={handleUsername} loading={loading} disabled={username.length < 3} className="gap-2">
                Claim @{username || "username"} <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col min-h-screen items-center justify-center px-6 text-center relative">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}>
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow-primary">
                <CheckCircle size={36} className="text-white" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-3xl font-bold font-display text-text-primary mb-2">You're in.</h2>
              <p className="text-text-secondary mb-2">Welcome to Verse, <strong>@{username}</strong></p>
              <p className="text-sm text-text-muted mb-8">Your wallet was created automatically. Your audience is now portable and on-chain.</p>
              <Link href="/">
                <Button variant="gradient" size="lg" className="gap-2">
                  Start creating <Zap size={16} className="fill-white" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <OnboardingInner />
    </ToastProvider>
  );
}
