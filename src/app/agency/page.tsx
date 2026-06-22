"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, TrendingUp, Users, DollarSign, ArrowRight, Star, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const BENEFITS = [
  { icon: <DollarSign size={20} className="text-accent-green" />, title: "10% commission forever", desc: "Earn 10% of Verse's platform fee on every transaction your creators make. Passive income that compounds as your roster grows." },
  { icon: <TrendingUp size={20} className="text-primary-light" />, title: "Real-time earnings dashboard", desc: "See every creator's performance, earnings, and your commission in one place. Full transparency, always." },
  { icon: <Users size={20} className="text-accent-cyan" />, title: "Founding Creator status", desc: "Your top 5 creators get featured placement on Verse's homepage and a Founding Creator badge for 90 days." },
  { icon: <Star size={20} className="text-accent-amber" />, title: "Priority support", desc: "Dedicated partner manager, priority onboarding for new creators, and early access to every new feature." },
];

const STEPS = [
  { n: "01", title: "Apply", desc: "Tell us about your agency and roster. We review within 48 hours." },
  { n: "02", title: "Get approved", desc: "Receive your unique agency referral link and partner dashboard access." },
  { n: "03", title: "Invite creators", desc: "Send your creators a personalised invite link. They sign up in 2 minutes." },
  { n: "04", title: "Earn together", desc: "Every time a creator earns on Verse, you earn 10% of our platform fee. Forever." },
];

const FAQS = [
  { q: "How does the 10% commission work?", a: "You earn 10% of Verse's platform fee — not 10% of your creators' earnings. Verse takes 10% of all creator earnings. You get 10% of that. So on $1,000 a creator earns, Verse gets $100, you get $10. Your creators' take-home is never affected." },
  { q: "Is there a minimum roster size to apply?", a: "No minimum. We work with boutique agencies with 5 creators and large agencies with 500+. What matters is creator quality and engagement, not follower count." },
  { q: "How long does the commission last?", a: "Forever. As long as a creator you referred is active on Verse, you earn commission on their transactions. There is no expiry." },
  { q: "Can creators already be on other platforms?", a: "Absolutely. Verse is built for creators to cross-post everywhere. Your creators don't have to leave TikTok, Instagram, or YouTube — they just add Verse as their owned monetisation layer." },
  { q: "When do we get paid?", a: "Commissions are paid out monthly via bank transfer, PayPal, or Stripe. Minimum payout is $50." },
];

export default function AgencyPage() {
  const [creators, setCreators] = useState(20);
  const [avgEarnings, setAvgEarnings] = useState(500);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState({ name: "", email: "", website: "", roster: "", niche: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const verseMonthlyFee = creators * avgEarnings * 0.10;
  const agencyCommission = verseMonthlyFee * 0.10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Nav */}
      <nav className="sticky top-0 z-40 glass-nav px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <span className="text-lg font-bold font-display gradient-text">Verse</span>
        </Link>
        <div className="flex items-center gap-4">
          <a href="#apply" className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-primary text-white">
            Apply now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold mb-6">
            <Star size={11} /> Agency Partner Program
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-display leading-tight mb-6">
            Your creators earn more.<br />
            <span className="gradient-text">So do you.</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Partner with Verse and earn 10% commission on every dollar your creators make on the platform — forever. No caps, no expiry, no catch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#apply" className="px-8 py-4 rounded-2xl bg-gradient-primary text-white font-bold text-base shadow-glow flex items-center justify-center gap-2">
              Apply to partner <ArrowRight size={18} />
            </a>
            <a href="#calculator" className="px-8 py-4 rounded-2xl bg-white/[0.06] border border-border text-text-secondary font-semibold text-base hover:bg-white/[0.1] transition-colors">
              See your earnings
            </a>
          </div>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything your agency gets</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="card p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <div className="font-bold text-text-primary mb-1">{b.title}</div>
                <div className="text-sm text-text-muted leading-relaxed">{b.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center">
              <div className="text-4xl font-black gradient-text mb-3">{s.n}</div>
              <div className="font-bold text-text-primary mb-2">{s.title}</div>
              <div className="text-sm text-text-muted leading-relaxed">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commission Calculator */}
      <section id="calculator" className="px-6 py-16 max-w-2xl mx-auto">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Your earnings calculator</h2>
          <p className="text-text-muted text-center text-sm mb-8">Estimate your monthly commission based on your roster.</p>

          <div className="space-y-6 mb-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-text-secondary">Number of creators</label>
                <span className="text-sm font-bold text-primary-light">{creators}</span>
              </div>
              <input type="range" min={1} max={200} value={creators} onChange={e => setCreators(+e.target.value)}
                className="w-full accent-violet-500" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-text-secondary">Avg monthly earnings per creator</label>
                <span className="text-sm font-bold text-primary-light">${avgEarnings.toLocaleString()}</span>
              </div>
              <input type="range" min={100} max={10000} step={100} value={avgEarnings} onChange={e => setAvgEarnings(+e.target.value)}
                className="w-full accent-violet-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-accent-cyan/5 border border-primary/20 rounded-2xl p-6 text-center">
            <div className="text-sm text-text-muted mb-1">Your estimated monthly commission</div>
            <div className="text-5xl font-black gradient-text mb-2">
              ${agencyCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-text-muted">
              {creators} creators × ${avgEarnings}/mo × 10% Verse fee × 10% your commission
            </div>
            <div className="mt-4 text-sm text-text-secondary">
              Your creators keep <span className="text-accent-green font-bold">$
              {(creators * avgEarnings * 0.90).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> /mo total
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="font-semibold text-text-primary text-sm">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="text-text-muted flex-shrink-0" /> : <ChevronDown size={16} className="text-text-muted flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="px-6 py-16 max-w-xl mx-auto">
        <div className="card p-8">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent-green/15 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-accent-green" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Application received</h3>
              <p className="text-text-muted text-sm">We'll review your application and reach out within 48 hours.</p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Apply to partner</h2>
              <p className="text-text-muted text-sm mb-6">We review every application personally. No bots.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Agency name *</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Acme Talent" className="input-base" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Contact email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@agency.com" className="input-base" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Website</label>
                    <input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                      placeholder="agency.com" className="input-base" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary block mb-1.5">Roster size</label>
                    <select value={form.roster} onChange={e => setForm(p => ({ ...p, roster: e.target.value }))}
                      className="input-base">
                      <option value="">Select...</option>
                      <option>1–10 creators</option>
                      <option>11–50 creators</option>
                      <option>51–200 creators</option>
                      <option>200+ creators</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Creator niches</label>
                  <input value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))}
                    placeholder="e.g. Fitness, Finance, Music, Gaming" className="input-base" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Anything else?</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us what you're looking for in a partnership..." rows={3}
                    className="input-base resize-none" />
                </div>
                <button type="submit" disabled={submitting || !form.name || !form.email}
                  className={cn("w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2",
                    form.name && form.email ? "bg-gradient-primary text-white shadow-glow" : "bg-white/[0.04] text-text-muted cursor-not-allowed")}>
                  {submitting ? "Sending..." : <>Submit application <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-text-muted">
        <Link href="/" className="hover:text-text-secondary transition-colors">← Back to Verse</Link>
        <span className="mx-3">·</span>
        <span>© 2026 Verse. Your content, your audience, your earnings.</span>
      </footer>
    </div>
  );
}
