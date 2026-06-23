"use client";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Users, Globe, Shield, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import config from "@/lib/config";

const FEATURES = [
  { icon: <Users size={18} />, title: "Your audience forever", desc: "Followers belong to you, not the platform. Take them anywhere." },
  { icon: <DollarSign size={18} />, title: "Earn instantly", desc: "Tips, memberships, and content licenses — you keep 97.5%." },
  { icon: <Globe size={18} />, title: "Always available", desc: "Your profile, your rules. No algorithm can bury your posts." },
  { icon: <Shield size={18} />, title: "No setup required", desc: "Sign up in seconds. No complexity — just create." },
];

export default function LoginPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) router.replace("/");
  }, [ready, authenticated, router]);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent-cyan/8 blur-[100px] rounded-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-16 pb-8 relative">
        {/* Logo */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow-primary animate-pulse-glow">
            <Zap size={28} className="text-white fill-white" />
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-4xl font-bold font-display mb-3">
          <span className="gradient-text">Own your audience.</span>
          <br /><span className="text-text-primary">Forever.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-text-secondary text-lg max-w-sm mb-10">
          {config.description}
        </motion.p>

        {/* Feature grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3 w-full max-w-sm mb-10">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
              className="card p-3 text-left">
              <div className="text-primary-light mb-1.5">{f.icon}</div>
              <div className="text-xs font-semibold text-text-primary mb-0.5">{f.title}</div>
              <div className="text-[11px] text-text-muted leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="w-full max-w-sm space-y-3">
          <Button
            variant="gradient"
            size="lg"
            fullWidth
            onClick={login}
            disabled={!ready}
            loading={!ready}
            className="text-base gap-2"
          >
            <Zap size={18} className="fill-white" />
            Get started — it&apos;s free
          </Button>
          <p className="text-xs text-text-muted">
            Email or social login · Ready in seconds · No credit card needed
          </p>
        </motion.div>
      </div>
    </div>
  );
}
